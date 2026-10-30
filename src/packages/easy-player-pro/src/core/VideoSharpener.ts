export interface VideoSharpenerOptions {
    sharpness?: number; // 锐化强度：推荐 0.0 ~ 1.0，默认为 0.6
}

export class VideoSharpener {
    private readonly canvas: HTMLCanvasElement;
    private sharpness: number;

    private gl: WebGLRenderingContext | null = null;
    private program: WebGLProgram | null = null;
    private texture: WebGLTexture | null = null;
    private positionBuffer: WebGLBuffer | null = null;

    private uResolution: WebGLUniformLocation | null = null;
    private uSharpness: WebGLUniformLocation | null = null;

    private rafId: number | null = null;
    private isRendering = false;
    private isDestroyed = false;

    private static readonly VS_SOURCE: string = `
    attribute vec2 a_position;
    varying vec2 v_texCoord;

    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
      // 翻转 Y 轴以对齐 HTMLVideo 纹理坐标系
      v_texCoord = vec2((a_position.x + 1.0) * 0.5, (1.0 - a_position.y) * 0.5);
    }
  `;

    private static readonly FS_SOURCE: string = `
    precision highp float;

    uniform sampler2D u_image;
    uniform vec2 u_resolution;
    uniform float u_sharpness;

    varying vec2 v_texCoord;

    void main() {
      vec2 step = 1.0 / u_resolution;

      // 采样中心像素及十字邻域（上下左右）
      vec3 c = texture2D(u_image, v_texCoord).rgb;
      vec3 a = texture2D(u_image, v_texCoord + vec2(0.0, -step.y)).rgb;
      vec3 b = texture2D(u_image, v_texCoord + vec2(-step.x, 0.0)).rgb;
      vec3 d = texture2D(u_image, v_texCoord + vec2(step.x, 0.0)).rgb;
      vec3 e = texture2D(u_image, v_texCoord + vec2(0.0, step.y)).rgb;

      // 局域极值对比度分析
      vec3 min_rgb = min(c, min(min(a, b), min(d, e)));
      vec3 max_rgb = max(c, max(max(a, b), max(d, e)));

      // 计算边缘锐化自适应权重，避免放大平坦噪点
      vec3 amp = clamp(min(min_rgb, 2.0 - max_rgb) / max(max_rgb, 1e-5), 0.0, 1.0);
      vec3 w = -sqrt(amp) * (u_sharpness * 0.2);

      // 加权滤波归一化
      vec3 result = (c + (a + b + d + e) * w) / (1.0 + 4.0 * w);

      gl_FragColor = vec4(clamp(result, 0.0, 1.0), 1.0);
    }
  `;

    constructor(
        canvasElement: HTMLCanvasElement,
        options: VideoSharpenerOptions = {}
    ) {
        this.canvas = canvasElement;
        this.sharpness = options.sharpness ?? 0.6;

        this.initGL();
    }

    private initGL(): void {
        const gl = this.canvas.getContext('webgl', {
            alpha: false,
            depth: false,
            stencil: false,
            antialias: false,
            preserveDrawingBuffer: false,
        });

        if (!gl) {
            throw new Error('WebGL context is not supported or failed to initialize.');
        }
        this.gl = gl;

        this.program = this.createProgram(gl, VideoSharpener.VS_SOURCE, VideoSharpener.FS_SOURCE);
        gl.useProgram(this.program);

        // 全屏四边形（两个三角面片拼接）
        const quadVertices = new Float32Array([
            -1.0, -1.0,
            1.0, -1.0,
            -1.0,  1.0,
            -1.0,  1.0,
            1.0, -1.0,
            1.0,  1.0,
        ]);

        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

        const aPosition = gl.getAttribLocation(this.program, 'a_position');
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

        // 初始化纹理
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        // 获取 Uniform 指针
        this.uResolution = gl.getUniformLocation(this.program, 'u_resolution');
        this.uSharpness = gl.getUniformLocation(this.program, 'u_sharpness');
    }

    private createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
        const shader = gl.createShader(type);
        if (!shader) {
            throw new Error('Failed to allocate WebGLShader.');
        }
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const info = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw new Error(`Shader compilation error: ${info}`);
        }
        return shader;
    }

    private createProgram(gl: WebGLRenderingContext, vs: string, fs: string): WebGLProgram {
        const vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vs);
        const fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fs);

        const program = gl.createProgram();
        if (!program) {
            throw new Error('Failed to allocate WebGLProgram.');
        }
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const info = gl.getProgramInfoLog(program);
            gl.deleteProgram(program);
            throw new Error(`Program link error: ${info}`);
        }

        // 链接完毕后剥离已编译的着色器，释放显存
        gl.detachShader(program, vertexShader);
        gl.detachShader(program, fragmentShader);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);

        return program;
    }

    public setSharpness(value: number): void {
        this.sharpness = Math.max(0.0, Math.min(1.0, value));
    }

    public startRender(): void {
        if (this.isDestroyed || this.isRendering || !this.gl || !this.program) return;
        this.isRendering = true;

        const renderLoop = (): void => {
            if (this.isDestroyed || !this.isRendering) return;
            this.renderFrame();
            this.rafId = requestAnimationFrame(renderLoop);
        };
        this.rafId = requestAnimationFrame(renderLoop);
    }

    private renderFrame(): void {
        const gl = this.gl;
        if (!gl) {
            return;
        }
        // 动态同步 Canvas 分辨率，契合视网膜与全屏拉伸
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        // 更新视频帧纹理
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        // @ts-ignore
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE);

        // 更新参数
        gl.uniform1f(this.uSharpness, this.sharpness);

        // 绘制渲染
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    public stopRender(): void {
        this.isRendering = false;
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    public destroy(): void {
        this.isDestroyed = true;
        this.stopRender();

        const gl = this.gl;
        if (!gl) return;

        if (this.positionBuffer) {
            gl.deleteBuffer(this.positionBuffer);
            this.positionBuffer = null;
        }
        if (this.texture) {
            gl.deleteTexture(this.texture);
            this.texture = null;
        }
        if (this.program) {
            gl.deleteProgram(this.program);
            this.program = null;
        }

        this.gl = null;
    }
}