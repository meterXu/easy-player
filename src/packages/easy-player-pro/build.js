import fs from 'fs';
function main(){
    fs.cp('./src/build','./lib/build', { recursive: true },(err)=>{
        if (err) {
            console.error('build复制失败:', err);
        } else {
            console.log('build目录复制成功！');
        }
    });
    fs.cp('./src/css','./lib/css', { recursive: true },(err)=>{
        if (err) {
            console.error('css复制失败:', err);
        } else {
            console.log('css目录复制成功！');
        }
    });
    fs.cp('./src/img','./lib/img', { recursive: true },(err)=>{
        if (err) {
            console.error('img复制失败:', err);
        } else {
            console.log('img目录复制成功！');
        }
    });
}
main();