/**
 * Created by surangac on 3/24/2015.
*/
var app=angular.module('foodAdmin', ['mutonCommunicationSrv','modalService',
    'shoppingCartService','ui.router','ui.bootstrap','ngStorage','toaster',
    'displayLabels_en','displayLabels_si', 'ngDialogSrv','flow','awsServices','clientSocket',
    'ngMessages','storageService','ngSanitize', 'MassAutoComplete','functionKey','requestKey']);
app.config(['$stateProvider','$urlRouterProvider','$locationProvider',
    function($stateProvider, $urlRouterProvider,$locationProvider) {
        $locationProvider.html5Mode(true);

        var hours = 24; // Reset when storage is more than 24hours
        var now = new Date().getTime();
        var setupTime = localStorage.getItem('setupTime');
        if (setupTime == null) {
            localStorage.setItem('setupTime', now)
        } else {
            if (now - setupTime > hours * 60 * 60 * 1000) {
                localStorage.clear();
                localStorage.setItem('setupTime', now);
            }
        }

        $urlRouterProvider.otherwise('/dashboard');
        $stateProvider
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: '/partials/apps/foodAdmin/dashboard.html',
                controller: pearsonControler
            })
            .state('orders', {
                url: '/orders',
                templateUrl: '/partials/apps/foodAdmin/finalConfirmedOrderTab.html',
                controller: OrdersTabController
            })
            .state('orders.today', {
                url: '/orders.today',
                templateUrl: '/partials/apps/foodAdmin/ordersToday.html',
                controller: OrdersController
            })
            .state('orders.history', {
                url: '/orders.history',
                templateUrl: '/partials/apps/foodAdmin/ordersHistory.html',
                controller: OrdersController
            })
            .state('group', {
                url: '/group',
                templateUrl: '/partials/apps/foodAdmin/manageUsersTab.html',
                controller: employeeTabControler
            })
            .state('mgEmployees', {
                url: '/mgEmployees',
                templateUrl: '/partials/apps/foodAdmin/manageUsersTab.html',
                controller: employeeTabControler
            })
            .state('mgEmployees.employees', {
                url: '/mgEmployees.employees',
                templateUrl: '/partials/apps/foodAdmin/employeeCreationTabPage.html',
                controller: manageEmployeesController
            })
            .state('mgEmployees.groups', {
                url: '/mgEmployees.groups',
                templateUrl: '/partials/apps/foodAdmin/groupCreationTabPage.html',
                controller: manageGroupsController
            })
            .state('profile',{
                url:'/profile',
                templateUrl:'/partials/apps/foodAdmin/userProfileTabPage.html',
                    controller:ProfilesTabController
            })
            .state('profile.user',{
                url:'/profile.user',
                templateUrl:'/partials/apps/foodAdmin/userProfileTab.html',
                controller:''
            })
            .state('profile.company',{
                url:'/profile.company',
                templateUrl:'/partials/apps/foodAdmin/companyProfileTab.html',
                controller:''
            })
            .state('mgRestaurants',{
                url:'/mgRestaurants',
                templateUrl:'/partials/apps/foodAdmin/assignRestaurantPage.html',
                controller:manageRestaurantsController
            })
            .state('reports',{
                url:'/reports',
                templateUrl:'/partials/apps/foodAdmin/reports/orderCancellationReport.html',
                controller:orderReportsController
            })
    }
]);

app.controller("initialController",function($scope,$http,comSrv,$state,$modal,$rootScope,$modalStack,$location,$timeout,FKey,RKey){
    $scope.modules=[
        {
            componentId:1,
            menuId:'dash01',
            moduleName:'Dashboard',
            moduleUrl:'/dashboard',
            imageClass:'fa-dashboard',
            menuList:[]
        },
        {
            componentId:2,
            menuId:'ord01',
            moduleName:'Order Management',
            moduleUrl:'/orders',
            imageClass:'fa fa-shopping-basket',
            menuList:[]
        },
        {
            componentId:3,
            menuId:'adm01',
            moduleName:'Admin',
            moduleUrl:'',
            imageClass:'fa fa-tasks',
            menuList:[
                {
                    componentId:31,
                    menuId:'adm01_01',
                    menuName:'Manage Profile',
                    url:'/profile/profile.user',
                    menuList:[]
                },
                {
                    componentId:32,
                    menuId:'adm01_02',
                    menuName:'Manage Employees',
                    url:'/mgEmployees',
                    menuList:[]
                },
                {
                    componentId:33,
                    menuId:'adm01_03',
                    menuName:'Manage Restaurants',
                    url:'/mgRestaurants',
                    menuList:[]
                }
            ]
        },
        {
            componentId:4,
            menuId:'rpt01',
            moduleName:'Reports',
            moduleUrl:'/reports',
            imageClass:'fa fa-line-chart',
            menuList:[]
        }
    ];

    $scope.clikced = function(module) {
        var modules = $scope.modules;
        var subLevelOpened = 0;
        var secondLevelClicked = false;
        if(module.menuList.length>0){
            module.menuList.forEach(function(secondLevelMenu){
                if(secondLevelMenu.secondLevelClicked){
                    secondLevelClicked = true;
                    secondLevelMenu.secondLevelClicked = false;
                    if(secondLevelMenu.activeSecondLevel){
                        subLevelOpened++;
                    }
                }
            });
            if(!secondLevelClicked){
                module.active = subLevelOpened>0? module.active:!module.active;
            }
        }
        for(var i = 0; i<modules.length; i++){
            if(modules[i].$$hashKey != module.$$hashKey){
                modules[i].active = false;
                if(modules[i].menuList.length >0){
                    for(var j = 0; j < modules[i].menuList.length; j++){
                        //console.log(modules[i]);
                        modules[i].menuList[j].activeSecondLevel = false;
                    }
                }
            }
        }
    };
    $scope.clikced_secondLevel= function(module) {
        module.secondLevelClicked=true;
        var thirdLevelClicked=false;
        if(module.menuList.length>0){
            module.menuList.forEach(function(thirdLevelMenu){
                if(thirdLevelMenu.thirdLevelClicked){
                    thirdLevelClicked=true;
                    thirdLevelMenu.thirdLevelClicked=false;
                }
                /*if(secondLevelMenu.activeSecondLevel){
                 subLevelOpened++;
                 }*/
            });
            if(!thirdLevelClicked){
                //module.activeSecondLevel = subLevelOpened>0? module.activeSecondLevel:!module.activeSecondLevel;
                module.activeSecondLevel =!module.activeSecondLevel;
            }
            // module.activeSecondLevel =!module.activeSecondLevel;
        }else{
            module.activeSecondLevel=true;
        }
        _.each($scope.modules, function (item) {
            var modules = item.menuList;
            if(modules) {
                for (var i = 0; i < modules.length; i++) {
                    if (modules[i].$$hashKey != module.$$hashKey) {
                        modules[i].activeSecondLevel = false;
                        if (modules[i].menuList.length > 0) {
                            for (var j = 0; j < modules[i].menuList.length; j++) {
                                modules[i].menuList[j].activeThirdLevel = false;
                            }
                        }
                    }
                }
            }
        });
    };
    $scope.clikced_thirdLevel= function(module) {
        module.thirdLevelClicked=true;
        module.activeThirdLevel=true;
        _.each($scope.modules, function (item) {
            var modules02 = item.menuList;
            if(modules02) {
                _.each($scope.modules, function (item2) {
                    var modules = item2.menuList;
                    if(modules) {
                        for(var i = 0; i<modules.length; i++){
                            if(modules[i].$$hashKey != module.$$hashKey){
                                modules[i].activeThirdLevel = false;
                            }
                        }
                    }
                });
            }
        });
    };

    /*$rootScope.$on('$stateChangeStart', function (event) {
        var top = $modalStack.getTop();
        if (top) {
            $modalStack.dismiss(top.key);
        }
        if($scope.authResponse==undefined && !localStorage.getItem('token') && !localStorage.getItem('authResponse')){
            window.location = $location.protocol()+"://"+$location.host()+":"+$location.port()+"/login";
        }
    });*/
});

//app.directive('loading',   ['$http' ,function ($http)
//{
//    return {
//        restrict: 'A',
//        link: function (scope, elm, attrs)
//        {
//            scope.isLoading = function () {
//                return $http.pendingRequests.length > 0;
//            };
//
//            scope.$watch(scope.isLoading, function (v)
//            {
//                if(v){
//                    console.log(elm);
//                    elm.hidden = true;
//                }else{
//                    elm.hidden = false;
//                    //elm.hide();
//                }
//            });
//        }
//    };
//
//}]);

app.directive('mtPrint', [function () {

        var printSection = document.getElementById('printSection');
        // if there is no printing section, create one
        if (!printSection) {
            printSection = document.createElement('div');
            printSection.id = 'printSection';
            document.body.appendChild(printSection);
        }else{
            printSection.innerHTML = '';
        }
        function link(scope, element, attrs) {
            element.on('click', function () {
                var elemToPrint = document.getElementById(attrs.printElementId);
                if (elemToPrint) {
                    printElement(elemToPrint);
                }
            });
            window.onafterprint = function () {
                // clean the print section before adding new content
                printSection.innerHTML = '';
            }

        }
        function printElement(elem) {
            // clones the element you want to print
            var domClone = elem.cloneNode(true);
            printSection.innerHTML = '';
            printSection.appendChild(domClone);
            window.print();
        }
        return {
            link: link,
            restrict: 'A'
        };

}]);

app.directive('enterKey', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.enterKey);
                });

                event.preventDefault();
            }
        });
    };
});


app.directive('dateFromToBox', function (dateFilter) {
    var date_fromat = 'yyyy-MM-dd';
    return {
        restrict: 'AE',
        link: function (scope) {
            var from = new Date();
            from.setMonth(from.getMonth() - 1);
            scope.srchDate = {
                from: dateFilter(from,date_fromat),
                to: dateFilter(new Date(),date_fromat)
            };
            scope.open_calendar_from = function($event){
                $event.preventDefault();
                $event.stopPropagation();
                scope.popup_calendar_to = false;
                scope.popup_calendar_from = !scope.popup_calendar_from;
            };
            scope.open_calendar_to = function($event){
                $event.preventDefault();
                $event.stopPropagation();
                scope.popup_calendar_from = false;
                scope.popup_calendar_to = !scope.popup_calendar_to;
            };
        },
        template :''+
        '<div class="date-from">'+
            '<div class="input-group">'+
                '<input class="form-control form-control-inline input-sm "  readonly ng-model="srchDate.from" datepicker-popup="'+date_fromat+'" is-open="popup_calendar_from" show-button-bar="false">'+
                '<span class="input-group-addon btn" style="padding: 3px 9px;" ng-click="open_calendar_from($event)"> <i class="fa fa-calendar"></i> </span> ' +
            '</div>'+
        '</div>'+
        '<div class="date-to">'+
            '<div class="input-group">'+
                '<input class="form-control form-control-inline input-sm " readonly ng-model="srchDate.to" datepicker-popup="'+date_fromat+'" is-open="popup_calendar_to" show-button-bar="false" >'+
                '<span class="input-group-addon btn" style="padding: 3px 9px;" ng-click="open_calendar_to($event)"> <i class="fa fa-calendar"></i> </span> ' +
            '</div>'+
        '</div>'
    };
});

app.directive('dateTimePicker',function(dateFilter){
    var date_fromat = 'yyyy-MM-dd';
    return {
        restrict: 'AE',

        link: function (scope) {

            var date = new Date();
            scope.minDate = date;
            scope.hrstep = 1;
            scope.mmstep = 5;
            scope.ismeridian = true;

            var minTime = new Date();
            if(scope.minOrderTime != undefined) {
                minTime.setMinutes(minTime.getMinutes() + parseInt(scope.minOrderTime) + 3);
            }else{
                scope.minOrderTime = 0;
            }
            scope.extime = minTime;
            scope.exDate = dateFilter(minTime, "yyyy-MM-dd");

            scope.openCalendar = function($event){
                $event.preventDefault();
                $event.stopPropagation();
                scope.popup = !scope.popup;
            };

            scope.$on('resetExpectedTime',function(event){
                setDateTime();
            });

            function setDateTime(){
                var minTime = new Date();
                if(scope.minOrderTime != undefined) {
                    minTime.setMinutes(minTime.getMinutes() + parseInt(scope.minOrderTime) + 3);
                }else{
                    scope.minOrderTime = 0;
                }
                scope.exDate = dateFilter(date, "yyyy-MM-dd");
                scope.extime = minTime;
                scope.exDate = dateFilter(minTime, "yyyy-MM-dd");
                scope.expectedDateTime = dateFilter(scope.exDate,'MMMM dd, yyyy') +" "+ dateFilter(scope.extime,'HH:mm');
            }

            scope.changedTime = function () {
                scope.expectedDateTime = dateFilter(scope.exDate,'MMMM dd, yyyy') +" "+ dateFilter(scope.extime,'HH:mm');
            };
            scope.changedDate = function () {
                scope.expectedDateTime = dateFilter(scope.exDate,'MMMM dd, yyyy') +" "+ dateFilter(scope.extime,'HH:mm');
                var exDate = new Date(scope.exDate);
                scope.exDate = dateFilter(exDate, "yyyy-MM-dd");
            };

            function resetDateTime(){
                var nowDateTime = new Date();
                nowDateTime.setMinutes(nowDateTime.getMinutes() + parseInt(scope.minOrderTime));
                var selectedDate = new Date(dateFilter(scope.exDate, 'yyyy-MM-dd'));
                var nowDate = new Date(dateFilter(nowDateTime, "yyyy-MM-dd"));
                if (nowDate.getTime() >= selectedDate.getTime()) {
                    if (scope.extime.getTime() < nowDateTime.getTime()) {
                        scope.extime = nowDateTime;
                    }
                }
            };

        },

        template :''+
        '<div class="date-from">'+
        '<div class="input-group" >'+
        '<input ng-change="changedDate()" class="form-control form-control-inline input-sm "  readonly ng-model="exDate"' +
        ' datepicker-popup="'+date_fromat+'" is-open="popup" min-date="minDate" show-button-bar="false">'+
        '<span class="input-group-addon btn" style="padding: 3px 9px;" ng-click="openCalendar($event)"> <i class="fa fa-calendar"></i> </span> ' +
        '</div>'+
        '</div>'+
        '<div class="date-to">'+
        '<div class="input-group">'+
        '<timepicker ng-model="extime" ng-change="changedTime()" hour-step="hrstep" minute-step="mmstep" show-meridian="ismeridian"></timepicker>'+
        '</div>'+
        '</div>'
    };
});

app.directive('phone', function($parse) {
    var PHONE_REGEXP = /^\+?\d+$/;
    //var PHONE_REGEXP = /^[\+]?(\d\-?){8,12}\d$/;
    return {
        restrice: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            var modelGetter = $parse(attrs['ngModel']);
            var modelSetter = modelGetter.assign;
            scope.$watch(attrs.ngModel,function(value){
                    if(!PHONE_REGEXP.test(value)) {
                        modelSetter(scope, '');
                    }

            });
        }
    }
});

app.directive('onlyCharacters', function($parse) {
    var PHONE_REGEXP = /^[a-zA-Z\s]+$/;
    //var PHONE_REGEXP = /^[\+]?(\d\-?){8,12}\d$/;
    return {
        restrice: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            var modelGetter = $parse(attrs['ngModel']);
            var modelSetter = modelGetter.assign;
            scope.$watch(attrs.ngModel,function(value){
                if(!PHONE_REGEXP.test(value)) {
                    modelSetter(scope, '');
                }

            });
        }
    }
});

// Common directive for Focus
app.directive('focusMe', function($timeout, $parse) {
    return {
        link: function(scope, element, attrs) {
            var model = $parse(attrs.focusMe);
            scope.$watch(model, function(value) {
                if(value === true) {
                    $timeout(function() {
                        element[0].focus();
                    });
                }
            });
            element.bind('blur', function() {
                scope.$apply(model.assign(scope, false));
            })
        }
    };
});

app.filter('convertTime',function(dateFilter){
    return function(date){
        if(date!=undefined){
            var expTime = new Date();
            var stArray=date.split(/[\s,-]+/);
            if(stArray.length == 4){
                expTime = Date.parse(stArray[1]+'/'+stArray[2]+'/'+stArray[0]+' '+stArray[3]);
                expTime = new Date(expTime);
                return dateFilter(expTime,'yyyy-MM-dd hh:mm a');
            }else {
                return 'Invalid Time Format';
            }
        }else{
            return 'Invalid Time';
        }

    };
});

app.directive('onLoadClicker', ['$timeout',
    function($timeout) {
        return {
            restrict: 'A',
            priority: -1,
            link: function($scope, iElm, iAttrs, controller) {
                $timeout(function() {
                    iElm.triggerHandler('click');
                }, 0);
            }
        };
    }
]);

app.run(function($window, $rootScope,$timeout) {
    var timer;
    $rootScope.online = navigator.onLine;
    $rootScope.reconnect = "";
    $window.addEventListener("offline", function () {
        $rootScope.$apply(function() {
            $rootScope.msg = "Your Device Lost its Internet Connection";
            $rootScope.dataPhase = 1;
            $rootScope.class = "offline-ui offline-ui-down offline-ui-down-5s";
            $rootScope.reconnect = "";
            timer = $timeout(function () {
                $rootScope.msg = "Attempting to Reconnect...";
                $rootScope.dataPhase = 2;
                $rootScope.class = "offline-ui offline-ui-down offline-ui-connecting offline-ui-waiting";
                $rootScope.reconnect = "Reconnect";
            }, 5 * 1000);
        });
    }, false);
    $window.addEventListener("online", function () {
        $rootScope.$apply(function() {
            $rootScope.msg = "Your Device is Connected to the Internet";
            $rootScope.dataPhase = 0;
            $rootScope.class = "offline-ui offline-ui-up offline-ui-up-5s";
            $rootScope.reconnect = "";
        });
    }, false);
});

app.filter('propsFilter', function() {
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            var keys = Object.keys(props);

            items.forEach(function(item) {
                var itemMatches = false;

                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});
