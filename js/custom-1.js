if (!window.runningTime) {
    window.runningTime = () => {
        const infoBox = document.querySelector('.footer .website-info-box')
        const tempDiv = document.createElement('div');
        tempDiv.setAttribute('class', 'info-item default')
        infoBox.appendChild(tempDiv)

        const since = '2024-12-04 00:00:00'
        const formatTimestamp = (timestamp) => {
            const now = Date.now()
            const timeDiff = Math.abs(now - timestamp)
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)
            return `${days} 天 ${hours} 小时 ${minutes} 分 ${seconds} 秒`
        }

        setInterval(() => {
            tempDiv.innerHTML = '本站已安全运行 ' + formatTimestamp(new Date(since).getTime())
        }, 1000)
    }
}
window.runningTime()

<script defer src="https://umami.nilin.cc/script.js" data-website-id="64554c97-f95a-4d3e-93b9-c952c656965f"></script>