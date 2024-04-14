export type SiteConfig = typeof siteConfig

export const siteConfig = {
    name: "Tools",
    description:
        "开发工具集",
    mainNav: [
        {
            title: "首页",
            href: "/",
        },
    ],
    linkGroups: [
        {
            name:"网络工具",
            links: [
                {
                    title:"WebSocket在线测试",
                    href:"/websocket",
                },
                {
                    title:"IP查询",
                    href:"/ip",
                },
            ],
        }
    ],
}
