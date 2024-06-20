# QTheme v2

![image](https://user-images.githubusercontent.com/62363188/231838331-e0ddcc7c-3c86-4483-80cb-2bab7d37f0b2.png)

[traQ] のテーマ作成・閲覧サービス  
(作成したテーマを公開できるのは traP 部員限定です)

## development
### 手元で動かす
```
$ pnpm install
$ docker compose up -d
$ pnpm run dev
```

### デプロイ
main ブランチにタグを打つと、CI が走って、その後 showcase にタグを打った段階でのリポジトリがデプロイされます

## env
手元で動かす際の環境変数

```
DATABASE_URL="mysql://root:root@localhost:3306/qtheme"
```

ログイン状態で試したい場合
```
DEBUG_USER=SSlime
```
(SSlime の部分はてきとうな ID に変えてください)
