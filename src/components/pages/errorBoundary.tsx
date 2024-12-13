import { Component, ErrorInfo, ReactNode } from "react";
import { BiSolidCarCrash } from "react-icons/bi";
import { LuReceipt } from "react-icons/lu";

type Props = {
    children: ReactNode,
    fallback?: ReactNode
}

export class ErrorBoundary extends Component<Props, { hasError: boolean, err?: Error }> {

    constructor(props: Props) {
        super(props);

        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return {
            hasError: true,
            err: error
        };
    }

    render(): ReactNode {
        return this.state.hasError ?
            (
                this.props.fallback ??
                <div className="place-items-center content-center space-y-12 w-full h-screen bg-app-primary text-app-t-primary px-4">
                    <h1 className="text-3xl place-items-center font-bold text-red-500">
                        <BiSolidCarCrash className=""/>
                        {this.state.err?.name}
                    </h1>

                    <h3 className="font-medium w-2/5 text-orange-400">
                        {this.state.err?.message}
                    </h3>
                    <div className="">
                        <h3 className="font-mono text-xs overflow-auto whitespace-pre-wrap">
                            <span className="text-gray-400 italic">Stack: </span>
                            {this.state.err?.stack}
                        </h3>
                        <h3 className="text-xs ">
                            <span className="italic text-gray-400">Cause: </span>
                            {this.state.err?.cause as string || null}
                        </h3>
                    </div>
                </div>
            )
            :
            this.props.children;
    }
}