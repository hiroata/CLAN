#!/bin/bash

echo "===================================="
echo "ブログ記事の復元処理を開始します"
echo "===================================="

# カウンター初期化
restored_count=0
error_count=0

# 10KB未満のファイルをリストアップ
echo "問題のある記事を検出中..."
broken_files=$(ls -la blog/article-utage-*.html | awk '$5 < 10000 {print $9}')
total_broken=$(echo "$broken_files" | wc -l)

echo "検出された問題のある記事数: $total_broken"
echo ""

# 各ファイルに対して復元処理
for file in $broken_files; do
    if [ -f "$file" ]; then
        echo "復元中: $file"
        
        # 前のコミットから復元
        if git checkout b44b467 -- "$file" 2>/dev/null; then
            echo "  ✓ 復元成功"
            ((restored_count++))
        else
            echo "  ✗ 復元失敗"
            ((error_count++))
        fi
    fi
done

echo ""
echo "===================================="
echo "復元処理完了"
echo "===================================="
echo "復元成功: $restored_count 件"
echo "復元失敗: $error_count 件"
echo ""

# 復元後のファイルサイズチェック
echo "復元後のファイルサイズ確認:"
echo "10KB未満のファイル数:"
ls -la blog/article-utage-*.html | awk '$5 < 10000' | wc -l
echo "30KB以上のファイル数:"
ls -la blog/article-utage-*.html | awk '$5 > 30000' | wc -l

echo ""
echo "処理が完了しました。"