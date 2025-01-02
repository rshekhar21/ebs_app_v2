import { jq, log } from "./bundel.js";


document.addEventListener('DOMContentLoaded', function(){
    let year = new Date().getFullYear();
    // document.querySelector('.copyright').innerHTML = `Copyright ${year}, All Rights Reserved`;
    // updateApplication();
    console.log('ok');  

    jq('button.start').click(function(){
        log('ok');
    })

    
})

function updateApplication() {
    try {
        const newVersionDiv = document.querySelector('.new-version');
        const downloadButton = document.querySelector('.download');
        const downloadProgress = document.querySelector('.progress');

        // Show the update available notification
        window.app.onUpdateAvailable(() => {
            newVersionDiv.classList.remove('d-none');
        });

        // Handle download button click
        downloadButton.addEventListener('click', () => {
            window.app.requestDownload();
            downloadProgress.classList.remove('d-none')
            // newVersionDiv.innerHTML = '<span>Downloading Update: <progress id="progressBar" max="100" value="0"></progress> <span id="progressText">0%</span></span>';
        });

        // Update progress bar
        window.app.onDownloadProgress((percent) => {
            document.getElementById('progressBar').style.width = `${Math.round(percent)}%`;
            document.getElementById('progressBar').textContent = `${Math.round(percent)}%`;
        });

        // Prompt user to install after download
        window.app.onUpdateDownloaded(() => {
            window.app.requestInstall();
        });
    } catch (error) {
        console.log(error);
    }
}