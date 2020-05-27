本文主要介绍如何快速地将腾讯云实时音视频 Demo（小程序）工程运行起来，您只需参考如下步骤依次执行即可。

## 1. 创建新的应用
进入腾讯云实时音视频 [控制台](https://console.cloud.tencent.com/rav) 创建一个新的应用，获得 SDKAPPID：
![](https://main.qcloudimg.com/raw/92d980b7ed3b1b4eebd02019e8a48243.png)
>!SDKAPPID 是腾讯云后台用来区分不同实时音视频应用的唯一标识，在后续开发过程中需要用到。

## 2. 激活实时音视频服务

### 检查实时音视频服务状态
在实时音视频 TRTC 控制台的 [应用列表](https://console.cloud.tencent.com/rav) 页面选择在第一步中创建的应用卡片，进入**应用详情**页面，然后单击【帐号信息】，查看“实时音视频服务状态”，以判断该应用的实时音视频服务是否可用。
- 如果实时音视频服务状态显示“可用”，即表示该应用的实时音视频服务已激活，当前处于服务可用状态。
![](https://main.qcloudimg.com/raw/28855a24a75fb641673af8f2731a0911.png)
- 如果实时音视频服务状态显示“不可用”，则表示该应用的实时音视频服务处于不可用状态，需要通过购买套餐包来激活。
![](https://main.qcloudimg.com/raw/2eb464eb34939ea772e7f0da1549c003.png)

### 购买套餐包
实时音视频套餐包采用预付费的计费方式，关于套餐包的详细说明请参见 [产品价格](https://cloud.tencent.com/document/product/647/17157)。

#### 购买6.6元测试体验套餐包（新用户专享）
针对实时音视频新用户，我们为您提供专属测试体验套餐包，您只需支付6.6元即可体验300分钟实时音视频通话时长。
实时音视频测试体验套餐包只能通过 [专属页面](https://buy.cloud.tencent.com/trtc_activity) 购买：
![](https://main.qcloudimg.com/raw/d9a07105fb050368f77b0e04e1d51e9e.png)
选择您需要激活的实时音视频服务 SDKAPPID（应用标识），单击【立即购买】，并根据页面提示完成付款操作即可购买成功。**购买成功后将会自动激活实时音视频服务状态。**

>!
- 每一个腾讯云账号只能购买一次测试体验套餐包。
- 测试体验套餐包分钟数使用完或过期时，将自动关闭实时音视频服务状态，再次激活需购买实时音视频正式套餐包。


#### 购买正式套餐包

为了避免您的业务因实时音视频套餐包分钟数使用完或过期而中断，建议您及时购买正式套餐包，使实时音视频服务始终保持可用状态。

>!
- 正式套餐包指的是入门包、标准包、企业包和尊享包。
- 正式套餐包使用完当月若未及时购买新的正式预付费套餐包，超出部分将按照实时音视频后付费月结计费方式（25元/千分钟）收取。

您可以直接访问实时音视频预付费套餐包的 [购买页面](https://buy.cloud.tencent.com/rav_th5)，选择适合您业务的套餐包以及您业务所使用的 SDKAPPID（应用标识），单击【立即购买】，并根据页面提示完成付款操作即可购买成功。**购买成功后将会自动刷新实时音视频服务状态。**
![](https://main.qcloudimg.com/raw/1da24d778c28e95f40ecd9bc5aad4f77.png)

## 3. 下载 Demo 源码
激活实时音视频服务之后，回到实时音视频 [控制台](https://console.cloud.tencent.com/rav)的**应用列表**页面，选择第一步新创建的应用卡片，进入该应用的详情页。单击【快速上手】即可看到源码下载地址：
![](https://main.qcloudimg.com/raw/064819772bf0ef727a377a4ee23f03eb.png)

## 4. 下载私钥文件
单击**下载公私钥**，下载并保存压缩包 **keys.zip** ，解压后可以得到 public_key 和 private_key 两个文件。用记事本打开 **private_key** 文件，并将其中的内容拷贝到控制台应用详情页的【生成Demo配置文件内容】的文本输入框中。
![](https://main.qcloudimg.com/raw/688b415f15fc0568d520af55dbb930fd.png)

## 5. 获得配置文件
单击【生成Demo配置文件内容】，即可获得一段 JSON 格式的文本内容，这段内容是由控制台根据您在第四步中填写的 private_key 基于非对称加密算法，生成的一组测试用的 userid 和 usersig。
![](https://main.qcloudimg.com/raw/5de8161bb72b2e19ebdb24ef6056751c.png)

复制上述 JSON 内容，并粘贴到 `pages/webrtc-room/account.js` 文件中（如果已经存在示例内容，请覆盖之）。

>! 此处方案仅用于快速跑通 Demo 示例。
> 真实的线上环境中，需要您的业务服务器根据 userid，使用上面提到的 private_key 实时计算出 usersig，这部分内容请参考 [如何计算UserSig](https://cloud.tencent.com/document/product/647/17275)。

## 6. 开通小程序类目与推拉流标签权限
出于政策和合规的考虑，微信暂时没有放开所有小程序对实时音视频功能（即 &lt;live-pusher&gt; 和 &lt;live-player&gt; 标签）的支持：

- 企业账号的小程序暂时只开放如下表格中的类目：

| 主类目 | 子类目  |小程序内容场景|
|-------|----------|----------|
| 社交| 直播 |涉及娱乐性质，如明星直播、生活趣事直播、宠物直播等。选择该类目后首次提交代码审核，需经当地互联网主管机关审核确认，预计审核时长7天左右|
| 教育| 在线视频课程 |网课、在线培训、讲座等教育类直播|
| 医疗| 互联网医院，公立医院 |问诊、大型健康讲座等直播|
| 金融| 银行、信托、基金、证券/期货、证券、期货投资咨询、保险、征信业务、新三板信息服务平台、股票信息服务平台（港股/美股）、消费金融 |金融产品视频客服理赔、金融产品推广直播等|
|汽车|	汽车预售服务|	汽车预售、推广直播|
|政府主体帐号|	-	|政府相关工作推广直播、领导讲话直播等|
|工具	|视频客服	|不涉及以上几类内容的一对一视频客服服务，如企业售后一对一视频服务等|

- 符合类目要求的小程序，需要在【微信公众平台】>【开发】>【接口设置】中自助开通该组件权限，如下图所示：
![](https://mc.qcloudimg.com/static/img/a34df5e3e86c9b0fcdfba86f8576e06a/weixinset.png)

## 7. 小程序服务器域名配置
&lt;webrtc-room&gt; 组件内部需要访问如下地址，请将以下域名在 【微信公众平台】>【开发】>【开发设置】>【服务器域名】中进行配置，添加到 **request 合法域名**中：

| 域名 | 说明 | 
|:-------:|---------|
|`https://official.opensso.tencent-cloud.com` | WebRTC音视频鉴权服务域名 | 
|`https://yun.tim.qq.com` | WebRTC音视频鉴权服务域名 | 
|`https://cloud.tencent.com`| 推流域名 | 
|`https://webim.tim.qq.com` | IM域名 | 

![](https://main.qcloudimg.com/raw/b3fb6291c097dda1606d46a5e8f2b810.png)

## 8. 编译运行

1. 安装微信小程序 [开发者工具](https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/download.html)，打开微信开发者工具，单击【小程序项目】按钮。
2. 输入您申请到的微信小程序 AppID（注意：不是上面的 SDKAppID），项目目录选择上一步下载到的代码目录（ **注意：** 目录请选择**根目录**，根目录包含有 `project.config.json`文件），单击【确定】创建小程序项目。
![](https://main.qcloudimg.com/raw/62d821ab972b8d65c5ea9d623b4f3ff5.png)
3. 按照上文第5步中的步骤修改 `pages/webrtc-room/account.js` 。
4. 使用手机进行测试，直接扫描开发者工具预览生成的二维码进入。
5. <font color='red'>开启调试模式</font>，体验和调试内部功能。开启调试可以跳过把这些域名加入小程序白名单的工作。

>!不同的手机进行预览体验时，要选择不同的体验 ID，因为同一个 ID 不能互相通讯。
![](https://main.qcloudimg.com/raw/9e28cb57bd7656641aec6a74b5c9dcb3.png)
	

## 常见问题
### 1. 开发和运行环境有什么要求？
- 微信 App 最低版本要求：
 - iOS 最低要求：6.5.21
 - Android 最低要求：6.5.19
- 小程序基础库最低版本要求：1.7.0
- 由于微信开发者工具不支持原生组件（即 &lt;live-pusher&gt; 和 &lt;live-player&gt; 标签），需要在真机上进行运行体验

### 2. 防火墙有什么限制？
由于 SDK 使用 UDP 协议进行音视频传输，所以对 UDP 有拦截的办公网络下无法使用，如遇到类似问题，请将如下端口加入防火墙的安全白名单中。

| 协议 | 端口号 |
|:--------:|:--------:|
| HTTP | 80 |
| HTTPS | 443 |
| UDP    | 443 |

### 3. 调试时为什么要开启调试模式？
开启调试可以跳过把这些域名加入小程序白名单的工作，否则可能会遇到登录失败，通话无法连接的问题。

### 4. 小程序源码会访问哪些域名？
&lt;webrtc-room&gt; 组件内部需要访问如下地址，您可以在 [微信公众平台](https://mp.weixin.qq.com)  > 开发 > 开发设置 > 服务器域名配置中进行配置：

| 域名 | 说明 | 
|:-------:|---------|
|`https://official.opensso.tencent-cloud.com` | WebRTC 音视频鉴权服务域名 | 
|`https://yun.tim.qq.com` | WebRTC 音视频鉴权服务域名 | 
|`https://cloud.tencent.com`| 推流域名 | 
|`https://webim.tim.qq.com` | IM 域名 | 
