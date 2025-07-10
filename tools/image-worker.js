// 画像処理用Web Worker
// 重い画像処理をメインスレッドから分離して実行

self.addEventListener('message', function(e) {
    const { type, data } = e.data;
    
    try {
        switch (type) {
            case 'resizeImage':
                resizeImageInWorker(data);
                break;
            case 'convertToWebP':
                convertToWebPInWorker(data);
                break;
            default:
                throw new Error(`Unknown message type: ${type}`);
        }
    } catch (error) {
        self.postMessage({
            type: 'error',
            error: error.message
        });
    }
});

// 画像リサイズ処理（Worker内）
async function resizeImageInWorker(data) {
    const { imageData, maxWidth, maxHeight, quality, fileName } = data;
    
    try {
        // OffscreenCanvasを使用（サポートされている場合）
        if (typeof OffscreenCanvas !== 'undefined') {
            const img = await createImageBitmap(imageData);
            
            // アスペクト比を維持したサイズ計算
            const aspectRatio = img.width / img.height;
            let newWidth = img.width;
            let newHeight = img.height;
            
            if (newWidth > maxWidth) {
                newWidth = maxWidth;
                newHeight = newWidth / aspectRatio;
            }
            
            if (newHeight > maxHeight) {
                newHeight = maxHeight;
                newWidth = newHeight * aspectRatio;
            }
            
            // 小数点以下を切り捨て
            newWidth = Math.floor(newWidth);
            newHeight = Math.floor(newHeight);
            
            // リサイズが不要な場合
            if (newWidth >= img.width && newHeight >= img.height) {
                self.postMessage({
                    type: 'resizeComplete',
                    fileName: fileName,
                    blob: imageData
                });
                return;
            }
            
            // OffscreenCanvasでリサイズ
            const canvas = new OffscreenCanvas(newWidth, newHeight);
            const ctx = canvas.getContext('2d');
            
            // 画質調整
            if (newWidth * newHeight > 4000000) {
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'medium';
            }
            
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            
            // Blobに変換
            const blob = await canvas.convertToBlob({
                type: 'image/jpeg',
                quality: quality / 100
            });
            
            self.postMessage({
                type: 'resizeComplete',
                fileName: fileName,
                blob: blob
            });
            
        } else {
            // OffscreenCanvasが使用できない場合はメインスレッドに戻す
            self.postMessage({
                type: 'fallbackToMain',
                fileName: fileName,
                reason: 'OffscreenCanvas not supported'
            });
        }
        
    } catch (error) {
        self.postMessage({
            type: 'error',
            fileName: fileName,
            error: error.message
        });
    }
}

// WebP変換処理（Worker内）
async function convertToWebPInWorker(data) {
    const { imageData, quality, fileName } = data;
    
    try {
        if (typeof OffscreenCanvas !== 'undefined') {
            const img = await createImageBitmap(imageData);
            
            const canvas = new OffscreenCanvas(img.width, img.height);
            const ctx = canvas.getContext('2d');
            
            // 画質調整
            if (img.width * img.height > 4000000) {
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'medium';
            }
            
            ctx.drawImage(img, 0, 0);
            
            // WebPに変換
            const blob = await canvas.convertToBlob({
                type: 'image/webp',
                quality: quality / 100
            });
            
            self.postMessage({
                type: 'convertComplete',
                fileName: fileName,
                blob: blob,
                originalSize: imageData.size,
                webpSize: blob.size
            });
            
        } else {
            // OffscreenCanvasが使用できない場合はメインスレッドに戻す
            self.postMessage({
                type: 'fallbackToMain',
                fileName: fileName,
                reason: 'OffscreenCanvas not supported'
            });
        }
        
    } catch (error) {
        self.postMessage({
            type: 'error',
            fileName: fileName,
            error: error.message
        });
    }
}

// 進捗報告
function reportProgress(current, total) {
    self.postMessage({
        type: 'progress',
        current: current,
        total: total
    });
}