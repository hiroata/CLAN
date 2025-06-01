/**
 * 画像ツール共通ユーティリティ関数
 * まえゆきツール - 画像変換ツール用共通機能
 */

// ファイルドロップとファイル選択の設定
function setupFileDropAndSelection(dropArea, fileInput, handleFilesCallback) {
    // ドラッグ&ドロップ機能
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropArea.classList.add('drag-over');
    }

    function unhighlight() {
        dropArea.classList.remove('drag-over');
    }

    // ファイルドロップ処理
    dropArea.addEventListener('drop', function(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFilesCallback(files);
    });

    // ファイル選択ボタン処理
    dropArea.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function() {
        handleFilesCallback(this.files);
    });
}

// ファイルアイテムのUI作成
function createFileItem(file, imageSrc, onRemoveCallback) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    
    const sizeInKB = (file.size / 1024).toFixed(1);
    
    fileItem.innerHTML = `
        <div class="file-preview">
            <img src="${imageSrc}" alt="${file.name}" class="preview-image">
        </div>
        <div class="file-info">
            <div class="file-name">${file.name}</div>
            <div class="file-size">${sizeInKB} KB</div>
        </div>
        <button type="button" class="remove-file-btn" aria-label="ファイルを削除">×</button>
    `;

    // 削除ボタンイベント
    const removeBtn = fileItem.querySelector('.remove-file-btn');
    removeBtn.addEventListener('click', function() {
        fileItem.remove();
        if (onRemoveCallback) onRemoveCallback();
    });

    return fileItem;
}

// UI状態更新
function updateUI(message, isError = false) {
    const messageElement = document.querySelector('.message') || createMessageElement();
    messageElement.textContent = message;
    messageElement.className = isError ? 'message error' : 'message success';
    
    // 3秒後に自動で消去
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 3000);
}

function createMessageElement() {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    document.querySelector('.tool-container').appendChild(messageElement);
    return messageElement;
}

// プログレスバー更新
function updateProgress(current, total) {
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    
    if (progressBar && progressText) {
        const percentage = Math.round((current / total) * 100);
        progressBar.style.width = percentage + '%';
        progressText.textContent = `${current}/${total} (${percentage}%)`;
    }
}

// 結果テーブル作成
function createResultTable(results) {
    const table = document.createElement('table');
    table.className = 'result-table';
    
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>ファイル名</th>
            <th>変換前サイズ</th>
            <th>変換後サイズ</th>
            <th>圧縮率</th>
            <th>ダウンロード</th>
        </tr>
    `;
    table.appendChild(thead);
    
    const tbody = document.createElement('tbody');
    results.forEach(result => {
        const row = document.createElement('tr');
        const compressionRate = ((1 - result.newSize / result.originalSize) * 100).toFixed(1);
        
        row.innerHTML = `
            <td>${result.fileName}</td>
            <td>${(result.originalSize / 1024).toFixed(1)} KB</td>
            <td>${(result.newSize / 1024).toFixed(1)} KB</td>
            <td>${compressionRate}%</td>
            <td><a href="${result.downloadUrl}" download="${result.fileName}" class="download-link">ダウンロード</a></td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    
    return table;
}

// ZIP作成とダウンロード（JSZipライブラリが必要）
function createZipDownload(files, zipName = 'converted_images.zip') {
    if (typeof JSZip === 'undefined') {
        console.warn('JSZip library not loaded');
        return;
    }
    
    const zip = new JSZip();
    
    files.forEach(file => {
        zip.file(file.name, file.blob);
    });
    
    zip.generateAsync({ type: 'blob' }).then(function(content) {
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = zipName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

// ファイルサイズをフォーマット
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 画像の寸法を取得
function getImageDimensions(file) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = function() {
            resolve({
                width: this.naturalWidth,
                height: this.naturalHeight
            });
        };
        img.src = URL.createObjectURL(file);
    });
}
