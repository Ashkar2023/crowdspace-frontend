import React, { ReactNode, useCallback, useEffect, useRef, useState } from "react";

export const useIntersection = <T extends HTMLElement>(options: IntersectionObserverInit, dep: React.DependencyList = []) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const observer = useRef<IntersectionObserver | null>(null);
    const lastNode = useRef<HTMLDivElement | null>(null);

    const observerRef = useCallback((node: HTMLDivElement) => {
        if (!lastNode && observer.current) observer.current?.unobserve(lastNode);

        if(!node) return;

        if(!observer.current){
            observer.current = new IntersectionObserver(([entry]) => {
                setIsVisible(entry.isIntersecting);
            }, options)
        }

        observer.current.observe(node);
        lastNode.current = node;
    }, []);


    useEffect(() => {
        return () => {
            if (observer.current) observer.current.disconnect();
            console.log("observer disconnected")
        }
    }, []);

    return { isVisible, observerRef }
}