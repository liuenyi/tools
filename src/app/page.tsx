import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"

export default function IndexPage() {
  return (
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
            {
                siteConfig.linkGroups?.map((item,index)=>{
                    return <>
                        <h1 className="text-2xl font-extrabold leading-tight tracking-tighter md:text-2xl">
                            {item.name}
                        </h1>
                        <p className="max-w-[700px] text-lg text-muted-foreground">
                            {item?.links?.map((link,index)=>{
                                return <>{index>0 && <span className={"text-blue-100"}> | </span>} <Link href={link.href} target={"_blank"}>{link.title}</Link></>
                            })}
                        </p>
                    </>
                })
            }

        </div>
        <div className="flex gap-4">
          <Link
              href={""}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants()}
          >
            更多工具
          </Link>
          <Link
              target="_blank"
              rel="noreferrer"
              href={""}
              className={buttonVariants({ variant: "outline" })}
          >
            关于我们
          </Link>
        </div>
      </section>
  )
}
