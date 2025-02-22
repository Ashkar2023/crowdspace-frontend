import Feed from './feed'

export const HomePage = () => {
    return (
        <div className='grid grid-cols-[4fr_3fr] h-full'>
            <Feed/>
            <div className='border-l border-app-tertiary'>

            </div>
        </div>
    )
}
