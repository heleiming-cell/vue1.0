<template>
<transition enter-active-class="fadeInDown" leave-active-class="fadeOutUp">
    <el-card class="box-card" :style="el_card_style">
        <div slot="header" class="clearfix">
            <span>{{panelName}}</span>
            <el-button style="float: right; padding: 3px 0" type="text"><i class="el-icon-close" @click="close"></i>
            </el-button>
        </div>
        <!--模式设定-->
        <el-row class="border-b">
            <el-col :span="24">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="设备信息" name="first">
                        <div class="cardClass flex" ref="imageWrapper">
                            <div class="code flex">
                                <div class="qrCode" id="qrcode"></div>
                            </div>
                            <div class="info flex">
                                <div class="flex"><span>资产名称：{{cardData.Name}}</span></div>
                                <div class="flex"><span>资产类型：{{cardData.CategoryName}}</span></div>
                                <div class="flex"><span>安装时间：{{cardData.CreateTime}}</span></div>
                                <div class="flex"><span>安装地址：{{cardData.AreaDecscription}}</span></div>
                            </div>
                        </div>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="cardVisible = false">取 消</el-button>
                            <el-button type="primary" @click="downloadIamge">下载</el-button>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="巡检记录" name="second">
                        <el-table :data="tableData" style="width: 100%" height="600">
                            <el-table-column prop="Id" label="设备编号" width="180">
                            </el-table-column>
                            <el-table-column prop="DataName" label="名称" width="180">
                            </el-table-column>
                            <el-table-column prop="AreaName" label="区域">
                            </el-table-column>
                            <el-table-column prop="Type" label="类型">
                                <template slot-scope="scope">
                                    <span>{{scope.row.Type==1?"现场巡检":"资产巡检"}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="address" label="巡检结果">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.Result==1" style="color:green">正常</span>
                                    <span v-if="scope.row.Result==0" style="color:red">异常</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>

                </el-tabs>
            </el-col>
        </el-row>
    </el-card>
</transition>
</template>

<script>
import QRCode from "qrcodejs2";
import html2canvas from "html2canvas";
export default {
    data() {
        return {
            el_card_style: '',
            activeName: 'first',
            panelName: '',
            cardData: {
                Name: "",
                CategoryName: '',
                CreateTime: '',
                AreaDecscription: ''

            },
            QRcodeCode: null,
            tableData: []
        }
    },
    props: {
        props_id: {
            default: ''
        }
    },
    mounted() {
        this.$ajax.get(this.$Order + '/sys/Device/QueryDeviceDetail', {
            params: {
                id: '1accd85d-e1e5-47e4-82d0-7aff052cf40d'
            }
        }).then(result => {
            if (result.data.Success) {
                this.cardData = result.data.Data;
                var row = this.cardData;
                $("#qrcode").html("");
                // this.cardVisible = true
                this.QRcodeCode = row.Id
                setTimeout(() => {
                    let qrcode = new QRCode("qrcode", {
                        width: 173, // 设置宽度
                        height: 173, // 设置高度
                        text: row.Id
                    });
                    html2canvas(this.$refs.imageWrapper, {
                        backgroundColor: null
                    }).then((canvas) => {
                        let dataURL = canvas.toDataURL("image/png");
                        this.qrcodeImageUrl = dataURL;

                    })
                }, 100)
            }
        });
    },
    methods: {
        handleClick(tab, event) {
            if (tab.index == "1") {
                this.$ajax.get(this.$Order + '/sys/inspectSheet/GetDeviceResult', {
                    params: {
                        id: '1accd85d-e1e5-47e4-82d0-7aff052cf40d'
                    }
                }).then(result=>{
                    if(result.data.Success)
                    this.tableData=result.data.Data;
                });
            }
        },
        close() {
            document.body.removeChild(this.$el);

        },
        downloadIamge() { //下载图片地址和图片名
            let imgsrc = this.qrcodeImageUrl
            let name = this.QRcodeCode
            var image = new Image();
            // 解决跨域 Canvas 污染问题
            image.setAttribute("crossOrigin", "anonymous");
            image.onload = function () {
                var canvas = document.createElement("canvas");
                canvas.width = image.width;
                canvas.height = image.height;
                var context = canvas.getContext("2d");
                context.drawImage(image, 0, 0, image.width, image.height);
                var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据

                var a = document.createElement("a"); // 生成一个a元素
                var event = new MouseEvent("click"); // 创建一个单击事件
                a.download = name || "photo"; // 设置图片名称
                a.href = url; // 将生成的URL设置为a.href属性
                a.dispatchEvent(event); // 触发a的单击事件
            };
            image.src = imgsrc;
        },
    }
}
</script>

<style lang="scss" scoped>
.box-card {
    width: 700px;
    margin: 0px auto;
    font-size: 14px;
    color: #616265;
    background: #1B1E26;
    border: 0;
    max-height: 580px;
}

.box-card /deep/ .el-card__body {
    text-align: center;
    padding-top: 0;
}

.box-card /deep/ .el-card__header {
    border-bottom: 1px solid #292D37 !important;
    padding: 10px 20px;
    overflow: hidden;
    font-size: 16px;
}

.box {
    border: 1px solid #333;
}

.active {
    color: #13D3D1;
}

.el-button {
    font-size: 18px;
    color: #535354;
    padding: 0
}

.box-card /deep/ .el-tabs__item.is-active {
    /* color:white !important; */
    background: unset !important;
    border: unset !important;

}

.flex {
    display: flex;
    align-items: center;
    justify-content: center;
}

.cardClass {
    // width: ;
    // background-color: #051430;
    border: 1px solid #087CA2;
    height: 247px;
    // width: 717px;
    margin: 20px auto;
    font-size: 12px;

    .code {
        width: 270px;
        height: 100%;
        border: 1px solid #087CA2;
        flex-wrap: wrap;
        color: white;

        .text {
            height: 30px;
            line-height: 30px;
        }

        .qrCode {
            width: 173px;
            height: 173px;
        }
    }

    .info {
        height: 100%;
        width: calc(100% - 271px);
        flex-wrap: wrap;

        >div {
            width: 100%;
            height: calc(25% - 2px);
            border: 1px solid #087CA2;
            justify-content: left;

            >span {
                margin-left: 30px;
            }
        }
    }
}
</style>
