# Songle Sync Raspberry Pi向けslaveプロジェクト

Raspberry PiのオンボードLEDが拍に合わせて明滅します。


## 必要なハードウェア

- [Raspberry Pi](https://www.raspberrypi.org/products/raspberry-pi-3-model-b/) (3 Model Bで動作確認しています)

## 初期設定

Node.jsをインストールするには以下を実行します。

```sh
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt install nodejs
```

## 使い方

以下のようにして実行してください。 `npm install` は最初の一度だけ必要です。

```sh
$ git clone https://github.com/SongleJp/songle-sync-app-pi
$ cd songle-sync-app-pi
$ npm install
$ node index.js
```

## ビルド方法

`index.ts` はTypeScriptで書かれているので、 `tsc` コマンドを使ってビルドしてください。 `index.js` が上書きされます。

```sh
$ tsc
```

`tsc` がインストールされていない環境では、まず以下のようにしてインストールする必要があります。

```sh
$ npm install -g typescript
```
