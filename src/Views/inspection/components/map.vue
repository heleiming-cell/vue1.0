<template>
<div class="map-container" id="map">

</div>
</template>

<script>
import mapIcon from '@/assets/point.png'
export default {
    props:{
        gis:{
            type:Object,
            default:()=>{
                return {
                    lng:null,
                    lat:null
                }
            }
        }
    },
    data() {
        return {
            mapContainer: null,
            mapMarker: null,
        }
    },
    mounted() {
        this.getMap()
    },
    methods: {
        //加载地图
        getMap() {
            this.mapContainer = new AMap.Map('map', {
                expandZoomRange: true,
                zoom: 17,
                zooms: [4, 20], //设置地图级别范围
                center: [104.020905, 30.564474],
                mapStyle: 'amap://styles/0f0487a085519df3c149a8dcd8130543',
                buildingAnimation: true,
                features: ['bg', 'point', 'road', 'building'],
                defaultCursor: 'default'
            })
            if(this.gis.lng && this.gis.lat){
                this.addMaker(this.gis.lng,this.gis.lat)
            }
            this.mapContainer.on('click',e=>{
                this.addMaker(e.lnglat.getLng(),e.lnglat.getLat())
            })
        },
        //添加图标
        addMaker(lng,lat) {
            if(this.mapMarker){
                this.mapMarker.setMap(null)
            }
            this.mapMarker = new AMap.Marker({
                icon:mapIcon,
                position: [lng, lat],
                offset: new AMap.Pixel(-13, -30)
            });
            this.mapMarker.setMap(this.mapContainer);
            this.$emit('change',{lng,lat})
        }
    }
}
</script>

<style lang="scss" scoped>
.map-container {
    height: 100%;
    width: 100%;
}
</style>
