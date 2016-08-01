/*** Created by Sudesh on 28-Jul-16.*/

function OrdersTabController($scope, $state) {
    $scope.tabs = [
        {
            heading: 'Today Orders',
            route: "orders.today",
            active: true,
            disabled: false,
            stateParaVlue: 1,
            "componentId": 9},
        {
            heading: 'Orders History',
            route: "orders.history",
            active: false,
            disabled: false,
            stateParaVlue: 3,
            "componentId": 10
        }
    ];

    var uiComponent=JSON.parse(localStorage.getItem('uiComponent'));
    _.each(uiComponent, function (ar) {
        for(var j=0; j<$scope.tabs.length; j++ ){
            if($scope.tabs.componentId == ar.componentId){
                $scope.tabs.componentId.splice(j,1);
                break;
            }
        }
    });

    $scope.go = function (route, stateParams) {
        $state.go(route, {cat: stateParams});
    };

    $scope.active = function (route) {
        return $state.is(route);
    };

    $scope.$on("$stateChangeSuccess", function () {
        $scope.tabs.forEach(function (tab) {
            tab.active = $scope.active(tab.route);
        });
    });
};

function OrdersController($scope,modalSrv){
    $scope.newOrders = [];
    $scope.newOrders.push({cartId:"2984",orderDate:"2016-7-18",customerMobile:"0771231232",
                           customerName:"Sudesh",ordLength:4,totalNetValue:400,deliveryOption:"",
                           expectedTime:"2016-7-20",paymentOption:"credit",paymentStatus:"paid",
                           ordstatus:"pending",ordchannel:"web"});
    $scope.newOrders.push({cartId:"1232",orderDate:"2016-7-19",customerMobile:"0761231232",
                           customerName:"Nimesha",ordLength:8,totalNetValue:300,deliveryOption:"",
                           expectedTime:"2016-7-20",paymentOption:"credit",paymentStatus:"pending",
                           ordstatus:"delivered",ordchannel:"web"});


    $scope.viewDetails = function () { //console.log(user)
        var modalDefaults = {
            backdrop: false,
            keyboard: true,
            modalFade: true,
            templateUrl:'finalOrderModal.html',
            size: 'lg',
            scope: $scope,
            controller: ''
        };
        modalSrv.showModal(modalDefaults, {});
    }

}