import { lazy, StrictMode, Suspense } from 'react';
import './index.scss';
import { createRoot } from 'react-dom/client';
import { LuLoader } from 'react-icons/lu';
const App = lazy(() => import("./app"))

createRoot(document.getElementById('root') as HTMLElement)
    .render(
        <StrictMode>
            <Suspense fallback={
                <div className='grid h-screen place-content-center'>
                    <LuLoader className='animate-spin' size={30} />
                </div>
            }>
                <App />
            </Suspense>
        </StrictMode>
    );