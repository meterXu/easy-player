import {
    XXWebBox,
    SideMenu,
    UserMenu,
    SearchMenu,
    HeadTitle,
    Hamburger,
    HeadBreadcrumb,
    Logo,
    FullScreen,
    DrawerMenu,
    DynamicMenu,
    ItemLink,
    AppMain,
    TabsView
} from './components/index'

XXWebBox.install = function (Vue){
    Vue.component(XXWebBox.__name,XXWebBox)
}

export {
    XXWebBox,
    SideMenu,
    UserMenu,
    SearchMenu,
    HeadTitle,
    Hamburger,
    HeadBreadcrumb,
    Logo,
    FullScreen,
    DrawerMenu,
    DynamicMenu,
    ItemLink,
    AppMain,
    TabsView
}
export default XXWebBox
