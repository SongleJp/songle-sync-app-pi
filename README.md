# Songle Sync Raspberry Pi向けslaveプロジェクト

## 初期設定

Raspberry Piの設定画面からホスト名を変えたりI2C通信を有効にしたりします。

```sh
sudo raspi-config
```

5インチLCDディスプレイをつないだ場合はドライバをインストールする必要もあります。

```sh
git clone https://github.com/goodtft/LCD-show.git
chmod -R 755 LCD-show
cd LCD-show/
```

Node.jsをインストールするには以下を実行します。

```sh
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt install nodejs
```

## 静的IPを設定する方法

`/etc/network/interfaces.d/eth0` を作成し、以下のような内容にします。

```sh
auto eth0
allow-hotplug eth0
iface eth0 inet static
address 192.168.3.107
netmask 255.255.0.0
gateway 192.168.1.1
dns-nameservers 8.8.8.8 8.8.4.4
```

これでだめな場合は `/etc/dhcpcd.conf` の末尾に以下の記述を足します。

```sh
interface eth0
static ip_address=192.168.3.106/16
static routers=192.168.1.1
static domain_name_servers=8.8.8.8 8.8.4.4
```

## 一般的な使い方説明

以下のようにして実行してください。 `npm install` は最初の一度だけ必要です。

```sh
$ npm install
$ node index.js
```

実行時に `GrovePi is not connected.` というエラーが出る場合は `i2cdetect` コマンドを実行し、GrovePiを表す `04` が表示されていることを確認してください。

```sh
root@dex:/home/pi# i2cdetect -y 1
     0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
00:          -- 04 -- -- -- -- -- -- -- -- -- -- --
10: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
20: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
30: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
40: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
50: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
60: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
70: -- -- -- -- -- -- -- --
```

`i2cdetect` の結果にGrovePiが表れない場合は、以下のコマンドを実行してGrovePiをリセットしてから再度試してください。

```sh
avrdude -c gpio -p m328p
```

なお、そもそもI2Cが有効になっていない場合は、以下のコマンドでRaspberry Piの設定画面を表示し、I2Cを有効にする必要があります。

```sh
$ sudo raspi-config
```

## ビルド方法の説明

`index.ts` はTypeScriptで書かれているので、 `tsc` コマンドを使ってビルドしてください。 `index.js` が上書きされます。

```sh
$ tsc
```

`tsc` がインストールされていない環境では、まず以下のようにしてインストールする必要があります。

```sh
$ npm install -g typescript
```
