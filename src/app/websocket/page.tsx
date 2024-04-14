"use client"

import { v4 as uuidv4 } from 'uuid';
import {
    CornerDownLeft,
    Share,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {useCallback, useEffect, useRef, useState} from "react";
import useWebSocket, {ReadyState} from "react-use-websocket";
import dayjs from "dayjs";

export default function Page() {
    const [, forceUpdate] = useState(0);
    const [inputUrl, setInputUrl] = useState<string>("");
    const [socketUrl, setSocketUrl] = useState<string | null>(null);
    const [messageHistory, setMessageHistory] = useState<any>([]);
    const {sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
    const outputRef = useRef<HTMLDivElement>(null);

    const [taskSecond, setTaskSecond] = useState<string>("5");
    const [taskMessage, setTaskMessage] = useState<string>("Heart");
    const taskRef = useRef<any>(undefined);

    const [myMessage, setMyMessage] = useState<string>("");



    useEffect(()=>{
        document.title = "WebSocket在线测试"
        setInputUrl(localStorage.getItem("websocket_url") || "")
    },[])

    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory((prev:any) => {
                const newHistory = [...prev, {data:lastMessage?.data,type:"receive",time:dayjs().format("HH:mm:ss"), key: uuidv4() }];
                if (newHistory.length > 2000) {
                    newHistory.shift();
                }
                return newHistory;
            });
        }
    }, [lastMessage]);

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    });


    const handleChangeSocketUrl = useCallback(
        (socketUrl: (string|null)) => {
            setSocketUrl(socketUrl)
        },
        []
    );

    const handleSendMessage = (myMessage:string)=>{
        setMessageHistory((prev:any) => {
            const newHistory = [...prev, {data:myMessage,type:"send",time:dayjs().format("HH:mm:ss"), key: uuidv4() }];
            if (newHistory.length > 2000) {
                newHistory.shift();
            }
            return newHistory;
        });
        sendMessage(myMessage);
    }

    const connectionStatus = {
        [ReadyState.CONNECTING]: '正在链接中',
        [ReadyState.OPEN]: '已经链接并且可以通讯',
        [ReadyState.CLOSING]: '连接正在关闭',
        [ReadyState.CLOSED]: '连接已关闭或者没有链接成功',
        [ReadyState.UNINSTANTIATED]: '尚未创建',
    }[readyState];

    return (
        <div className={"container h-full relative pt-4"}>
            <div className={"relative grid w-full h-full scroll-m-20 gap-4 rounded-lg border bg-background border-border"}>
                <div className="grid w-full h-full overflow-hidden">
                    <div className="flex h-full overflow-hidden flex-col pl-[20px] pr-[20px]">
                        <header className="sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4">
                            <h1 className="text-xl font-semibold">WebSocket在线测试</h1>
                            <Button
                                variant="outline"
                                size="sm"
                                className="ml-auto gap-1.5 text-sm"
                            >
                                <Share className="size-3.5" />
                                分享
                            </Button>
                        </header>
                        <main className="grid flex-1 gap-4 overflow-hidden p-4 md:grid-cols-2 lg:grid-cols-3  ">
                            <div className="flex-col items-start gap-8 md:flex">
                                    <fieldset className="w-full grid gap-6 rounded-lg border p-4">
                                        <legend className="-ml-1 px-1 text-sm font-medium">
                                            服务器配置
                                        </legend>
                                        <div className="grid grid-cols-[1fr,5rem] gap-2">
                                            <Input value={inputUrl} onChange={e=>{
                                                localStorage.setItem("websocket_url", e.target.value)
                                                setInputUrl(e.target.value);
                                            }} type="text" placeholder="WebSocket地址" />
                                            <Button variant={readyState === ReadyState.OPEN ? "destructive" : "default"} onClick={()=>{
                                                setSocketUrl(readyState === ReadyState.OPEN? null : inputUrl)
                                            }}>{readyState === ReadyState.OPEN ? "关闭连接" : "开启连接"}</Button>
                                        </div>
                                    </fieldset>
                                <fieldset className="w-full grid gap-6 rounded-lg border p-4">
                                    <legend className="-ml-1 px-1 text-sm font-medium">
                                        发包设置
                                    </legend>
                                    <div className="grid grid-cols-[1rem,3rem,5rem,1fr,5rem] items-center gap-2">
                                        <div>每</div>
                                        <div><Input className={"text-center"} defaultValue={"5"} onChange={e=>{
                                            setTaskSecond(e.target.value)
                                        }} /></div>
                                        <div>秒发送内容</div>
                                        <div><Input defaultValue={"Heart"} onChange={e=>{
                                            setTaskMessage(e.target.value)
                                        }} /></div>
                                        <div><Button variant={taskRef.current ? "destructive" : "default"} onClick={()=>{
                                            if (taskRef.current){
                                                clearInterval(taskRef.current)
                                                taskRef.current = undefined
                                            }else{
                                                handleSendMessage(taskMessage);
                                                taskRef.current = setInterval(()=>{
                                                    handleSendMessage(taskMessage);
                                                }, Number(taskSecond)*1000);
                                            }
                                            forceUpdate(Math.random);

                                        }}>{taskRef.current?"停止发送":"开始发送"}</Button></div>
                                    </div>
                                    <div className="grid gap-3">
                                        <Textarea
                                            id="message"
                                            placeholder="需要发送到服务端的内容"
                                            className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                                            onChange={e=>{
                                                setMyMessage(e.target.value);
                                            }}
                                        />
                                        <div className="flex items-center p-3 pt-0">
                                            <Button type="submit" size="sm" className="ml-auto gap-1.5" onClick={e=>{
                                                handleSendMessage(myMessage)
                                            }}>
                                                发送到服务端
                                                <CornerDownLeft className="size-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </fieldset>·
                                <fieldset className="w-full grid gap-6 rounded-lg border p-4">
                                    <legend className="-ml-1 px-1 text-sm font-medium">
                                        调试信息
                                    </legend>
                                    <div className="">
                                        连接状态：<span className={readyState === ReadyState.OPEN ? "text-green-500" : "text-gray-500"}>{connectionStatus}</span>
                                    </div>
                                </fieldset>
                            </div>
                            <div ref={outputRef} className="relative h-full overflow-auto bg-amber-300 flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2 border-2">
                                <Badge variant="outline" className="absolute right-3 top-3">
                                    Output
                                </Badge>
                                <div className={"h-full"}>
                                    {messageHistory?.map((item:any) => {
                                        return <div key={uuidv4()} className={"mt-4"}>
                                            <div className={"text-xs font-bold"}><span className={item.type==="send"?"text-green-500":"text-blue-500"}>{item.type==="send"?"发送消息":"收到消息"}</span> {item.time}</div>
                                            <div className={"text-xs mt-1"}>{item.data}</div>
                                        </div>
                                    })}
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>

    )
}
