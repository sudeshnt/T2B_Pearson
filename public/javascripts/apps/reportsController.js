/**
 * Created by Sudesh  on 29-Jul-16.
 */
function orderReportsController($scope){
    $scope.orderList = [];
    $scope.orderList.push({cartId:"2984",orderDate:"2016-7-18",customerMobile:"0771231232",
        customerName:"Sudesh",ordLength:4,totalNetValue:400,deliveryOption:"",
        expectedTime:"2016-7-20",paymentOption:"credit",paymentStatus:"paid",
        ordstatus:"pending",ordchannel:"web"});
    $scope.orderList.push({cartId:"1232",orderDate:"2016-7-19",customerMobile:"0761231232",
        customerName:"Nimesha",ordLength:8,totalNetValue:300,deliveryOption:"",
        expectedTime:"2016-7-20",paymentOption:"credit",paymentStatus:"pending",
        ordstatus:"delivered",ordchannel:"web"});

}