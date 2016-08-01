/**
 * Created by Sudesh on 29-Jul-16.
 */

function pearsonControler($scope, comSrv, socket, $q, localCache, modalSrv, dateFilter, $timeout,FKey) {
    function clicked(){
        console.log('clicked');
    }

};

function employeeTabControler($scope, $state) {
    $scope.tabs = [
        {heading: 'Employees', route: "mgEmployees.employees", active: true, disabled: false, "componentId": 34},
        {heading: 'Groups', route: "mgEmployees.groups", active: false, disabled: false, "componentId": 35}
    ];
    /*var uiComponent = JSON.parse(localStorage.getItem('uiComponent'));
     _.each(uiComponent, function (ar) {
     for (var j = 0; j < $scope.tabs.length; j++) {
     if ($scope.tabs.componentId == ar.componentId) {
     $scope.tabs.componentId.splice(j, 1);
     break;
     }
     }
     });*/

    $scope.go = function (route) {
        $state.go(route);
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

function manageEmployeesController($scope, modalSrv) {
    var modalDefaults = {
        backdrop: false,
        keyboard: true,
        modalFade: true,
        templateUrl: 'employeeModal.html',
        size: 'lg',
        scope: $scope,
        controller: ''
    };
    $scope.clickAddNew = function () {
        $scope.selectedEmployee = {};
        $scope.empLogo = {};
        $scope.empLogo.imageUri = "https://s3-ap-southeast-1.amazonaws.com/t2buy/dYfHPRJh-no-image.png";
        $scope.mode = 1;
        $scope.functionKey = 1;
        $scope.newEmployee = false;
        modalSrv.showModal(modalDefaults, {});
    };
    $scope.editDetails = function () {
        $scope.selectedEmployee = {};
        $scope.empLogo = {};
        $scope.empLogo.imageUri = "https://s3-ap-southeast-1.amazonaws.com/t2buy/dYfHPRJh-no-image.png";
        $scope.mode = 1;
        $scope.functionKey = 1;
        $scope.newEmployee = false;
        modalSrv.showModal(modalDefaults, {});
    };

};

function manageGroupsController($scope, modalSrv, comSrv, FKey, RKey) {

    $scope.newGroup = {};
    $scope.updateGroup = {};

    init();

    function init() {
        loadGroups();
    };
    function loadGroups(){
        var reqJSON={
            corporateId:1,
            authObj:{
                "functionId":FKey.GET_CORPORATE_GROUPS_BY_COOP_ID.FUNCTION_ID,
                "moduleId":RKey.CORPORATE_SERVICE.SERVICE_ID,
                "requestId":RKey.CORPORATE_SERVICE.FUNCTION.GET_CORPORATE_SERVICE_GROUPS_BY_COOP_ID,
                "userToken": '',
                "userName": '',
                "orgId": '',
                "branchId": ''
            }
        };
        comSrv.postCall('/',reqJSON, function (status, data) {
            if (status == 200 || status == 201) {
               $scope.allGroups = data;
            }
        });
    };
    $scope.addEntitlement = function () { //console.log(user)
        var entitlementModalDefaults = {
            backdrop: false,
            keyboard: true,
            modalFade: true,
            templateUrl: 'entitlementModal.html',
            size: 'lg',
            scope: $scope,
            controller: addUpdateEntitlementController
        };

        modalSrv.showModal(entitlementModalDefaults, {});

        function addUpdateEntitlementController($scope, $modalInstance) {
            $scope.enModalOptions = {};
            $scope.enModalOptions.close = function (result) {
                $modalInstance.dismiss('cancel');
            };
            $scope.enModalOptions.roleLists = [{roleId:1,roleName:"unassigned role 1"},{roleId:2,roleName:"unassigned role 2"}];
            $scope.enModalOptions.assignRoles = [{roleId:1,roleName:"assigned role 1"},{roleId:2,roleName:"assigned role 2"}];

            /* loadRoles();*/

            $scope.searchQueryAvailableRole = '';
            $scope.searchQueryAssignRole = '';

            /* function loadRoles() {
             var reqJSON = {
             orgId: authResponse.organizationData.orgId,
             authObj: {
             "functionId": FKey.ADD_EMPLOYEE_TO_USER_ROLE.FUNCTION_ID,
             "moduleId": RKey.SECURITY_SERVICE.SERVICE_ID,
             "requestId": RKey.SECURITY_SERVICE.FUNCTION.GET_ENTITLEMENT_ORG_ROLES,
             "userToken": authResponse.token,
             "userName": authResponse.userData.userName,
             "orgId": authResponse.userData.organizationId,
             "branchId": authResponse.userData.branchId
             }
             };
             comSrv.postCall('/', reqJSON, function (status, data) {
             if (status == 200 || status == 201) {
             removeDefault(data);
             loadAssignRoles();
             } else {
             if (data.Error == 3) {
             comSrv.popMessage(data.rejectMessage, 'note');
             } else if (status == 500) {
             comSrv.popMessage('Internal server error', 'error');
             }
             }
             });
             };*/

            /*function removeDefault(data) {
             //$scope.enModalOptions.assignRoles = loadAssignRoles();
             if (data) {
             _.each(data, function (r) {
             if (!r.sysDefault) {
             $scope.enModalOptions.roleLists.push(r);
             }
             });
             } else {
             _.each($scope.enModalOptions.assignRoles, function (ar) {
             for (var x = 0; x < $scope.enModalOptions.roleLists.length; x++) {
             if ($scope.enModalOptions.roleLists[x].roleId == ar.roleId) {
             $scope.enModalOptions.roleLists.splice(x, 1);
             --x;
             }
             }
             });
             }

             };*/

            $scope.enModalOptions.addingItems = function (remvArray, addArray, all) {
                if (all) {
                    _.each(remvArray, function (r) {
                        r.cheked = true;
                    });
                }
                for (var x = 0; x < remvArray.length; x++) {
                    if (remvArray[x].cheked) {
                        addArray.push(remvArray[x]);
                        remvArray[x].cheked = false;
                        remvArray.splice(x, 1);
                        --x;
                    }
                }
            };

            $scope.enModalOptions.removingItems = function (addArray, remvArray, all) {
                if (all) {
                    _.each(remvArray, function (r) {
                        r.cheked = true;
                    });
                }
                //console.log(remvArray)
                for (var x = 0; x < remvArray.length; x++) {
                    if (remvArray[x].cheked) {
                        addArray.push(remvArray[x]);
                        remvArray[x].cheked = false;
                        remvArray.splice(x, 1);
                        --x;
                    }
                }
            };

            /* $scope.enModalOptions.addUpdateEntitlement = function () {
             var sendList = [];
             _.each($scope.enModalOptions.assignRoles, function (f) {
             delete f.cheked;
             // delete f.createdBy;
             // delete f.isDefault;
             // delete f.orgId;
             sendList.push(f);
             });

             var reqJSON = {
             "userName": user.userName,
             "roleObj": sendList,
             authObj: {
             "functionId": FKey.ADD_EMPLOYEE_TO_USER_ROLE.FUNCTION_ID,
             "moduleId": RKey.SECURITY_SERVICE.SERVICE_ID,
             "requestId": RKey.SECURITY_SERVICE.FUNCTION.PUT_ENTITLEMENT_ASSIGN_USER_ROLES,
             "userToken": authResponse.token,
             "userName": authResponse.userData.userName,
             "orgId": authResponse.userData.organizationId,
             "branchId": authResponse.userData.branchId
             }
             };
             console.log(reqJSON.roleObj);
             comSrv.postCall('/', reqJSON, function (status, data) {
             if (status == 200 || status == 201) {
             comSrv.popMessage('Successfully Updated', 'success');
             $scope.enModalOptions.close();
             } else {
             if (data.Error == 3) {
             comSrv.popMessage(data.rejectMessage, 'note');
             } else if (status == 500) {
             comSrv.popMessage('Internal server error', 'error');
             }
             $scope.enModalOptions.close();
             }
             });
             };*/

            /* $scope.clickItems = function (checkStatus, item) {
             if (checkStatus) {
             item.selected = true;
             } else {
             item.selected = false;
             }
             $scope.checkBox = true;
             _.each($scope.discountGroups, function (opt) {
             if (opt.selected) {
             $scope.checkBox = false;
             }
             });
             };*/

            /* function loadAssignRoles() {
             var reqJSON = {
             userName: user.userName,
             authObj: {
             "functionId": FKey.ADD_EMPLOYEE_TO_USER_ROLE.FUNCTION_ID,
             "moduleId": RKey.SECURITY_SERVICE.SERVICE_ID,
             "requestId": RKey.SECURITY_SERVICE.FUNCTION.GET_ENTITLEMENT_USER_ROLES,
             "userToken": authResponse.token,
             "userName": authResponse.userData.userName,
             "orgId": authResponse.userData.organizationId,
             "branchId": authResponse.userData.branchId
             }
             };
             comSrv.postCall('/', reqJSON, function (status, data) {
             if (status == 200 || status == 201) {
             $scope.enModalOptions.assignRoles = data;
             removeDefault();
             } else {
             if (data.Error == 3) {
             comSrv.popMessage(data.rejectMessage, 'note');
             } else if (status == 500) {
             comSrv.popMessage('Internal server error', 'error');
             }
             $scope.enModalOptions.assignRoles = [];
             removeDefault();
             }
             });
             };*/
        };
    };

    var addUserModalDefaults = {
        backdrop: false,
        keyboard: true,
        modalFade: true,
        templateUrl: 'addGroupModal.html',
        size: 'md',
        scope: $scope,
        controller: addUpdateGroupsController
    };
    var editUserModalDefaults = {
        backdrop: false,
        keyboard: true,
        modalFade: true,
        templateUrl: 'editGroupModal.html',
        size: 'md',
        scope: $scope,
        controller: addUpdateGroupsController
    };
    function addUpdateGroupsController($modalInstance) {
        $scope.modalOptions = {};
        $scope.addOrUpdateUserStatus = "add";
        // add or update group details
        $scope.modalOptions.close = function (result) {
            $modalInstance.dismiss('cancel');
        };
        $scope.modalOptions.addGroup = function () {
            console.log($scope.newGroup,FKey.CREATE_NEW_CORPORATE_GROUP.FUNCTION_ID, RKey.CORPORATE_SERVICE.SERVICE_ID);
            var reqJSON = {
                newGroup: {
                    "corporateId":$scope.newGroup.corporateId,
                    "groupName":$scope.newGroup.groupName,
                    "groupBuyingPower":$scope.newGroup.groupBuyingPower,
                    "userDefaultBuyingPower": $scope.newGroup.empBuyingPower,
                    "isApprovalRequred": $scope.newGroup.isApprovalRequired,
                },
                authObj: {
                    "functionId": FKey.CREATE_NEW_CORPORATE_GROUP.FUNCTION_ID,
                    "moduleId": RKey.CORPORATE_SERVICE.SERVICE_ID,
                    "requestId": RKey.CORPORATE_SERVICE.FUNCTION.POST_CORPORATE_SERVICE_ADD_NEW_GROUP,
                    "userToken": '',
                    "userName": '',
                    "orgId": '',
                    "branchId": ''
                }
            };
            comSrv.postCall('/', reqJSON, function (status, data) {
                if (status == 200) {
                    comSrv.popMessage('Corporate Group Successfully Added', 'success');

                    $scope.modalOptions.close();
                } else {
                    if (data.Error == 3) {
                        comSrv.popMessage(data.rejectMessage, 'note');
                    } else if (status == 500) {
                        comSrv.popMessage('Internal server error', 'error');
                    }
                }
            });
        };
        $scope.modalOptions.editGroup = function () {
            var reqJSON = {
                updateGroup: {
                    "groupId":$scope.updateGroup.groupId,
                    "corporateId":$scope.updateGroup.corporateId,
                    "groupName":$scope.updateGroup.groupName,
                    "groupBuyingPower":$scope.updateGroup.groupBuyingPower,
                    "userDefaultBuyingPower": $scope.updateGroup.empBuyingPower,
                    "isApprovalRequred": $scope.updateGroup.isApprovalRequired,
                },
                authObj: {
                    "functionId": FKey.UPDATE_CORPORATE_GROUP_BY_GROUP_ID.FUNCTION_ID,
                    "moduleId": RKey.CORPORATE_SERVICE.SERVICE_ID,
                    "requestId": RKey.CORPORATE_SERVICE.FUNCTION.PUT_CORPORATE_SERVICE_UPDATE_GROUP,
                    "userToken": '',
                    "userName": '',
                    "orgId": '',
                    "branchId": ''
                }
            };
             comSrv.postCall('/', reqJSON, function (status, data) {
                 if (status == 200) {
                     comSrv.popMessage('Corporate Group Successfully Updated', 'success');
                     $scope.modalOptions.close();
                 }else {
                     if (data.Error == 3) {
                         comSrv.popMessage(data.rejectMessage, 'note');
                     } else if (status == 500) {
                         comSrv.popMessage('Internal server error', 'error');
                     }
                 }
             });
        };

    };

    $scope.clickAddNew = function () {
        $scope.selectedEmployee = {};
        $scope.empLogo = {};
        $scope.empLogo.imageUri = "https://s3-ap-southeast-1.amazonaws.com/t2buy/dYfHPRJh-no-image.png";
        $scope.mode = 1;
        $scope.functionKey = 1;
        $scope.newEmployee = false;
        modalSrv.showModal(addUserModalDefaults, {});
    };
    $scope.editDetails = function (group) {
        $scope.updateGroup.groupId = group.groupId;
        $scope.updateGroup.corporateId = group.corporateId;
        $scope.updateGroup.groupName = group.groupName;
        $scope.updateGroup.groupBuyingPower = group.groupBuyingPower;
        $scope.updateGroup.empBuyingPower = group.userDefaultBuyingPower;
        $scope.updateGroup.isApprovalRequired = group.isApprovalRequred;
        modalSrv.showModal(editUserModalDefaults, {});
    };

};

function ProfilesTabController($scope, $state){
    $scope.tabs = [
        {heading: 'User Profile', route: "profile.user", active: true, disabled: false, "componentId": 311},
        {heading: 'Company Profile', route: "profile.company", active: false, disabled: false, "componentId": 312}
    ];
    /*var uiComponent = JSON.parse(localStorage.getItem('uiComponent'));
     _.each(uiComponent, function (ar) {
     for (var j = 0; j < $scope.tabs.length; j++) {
     if ($scope.tabs.componentId == ar.componentId) {
     $scope.tabs.componentId.splice(j, 1);
     break;
     }
     }
     });*/

    $scope.go = function (route) {
        $state.go(route);
    };

    $scope.active = function (route) {
        return $state.is(route);
    };

    $scope.$on("$stateChangeSuccess", function () {
        $scope.tabs.forEach(function (tab) {
            tab.active = $scope.active(tab.route);
        });
    });
}

function manageProfilesController($scope){

}

function manageRestaurantsController($scope){
    /*$scope.addEntitlement = function () {*/ //console.log(user)

    $scope.enModalOptions = {};
    /*$scope.enModalOptions.close = function (result) {
     $modalInstance.dismiss('cancel');
     };*/
    $scope.enModalOptions.assignedRestaurantsList = [{restaurantId:1,restaurantName:"assigned Restaurant 1"},{restaurantId:2,restaurantName:"assigned Restaurant 2"}];

    $scope.enModalOptions.restaurantsLists = [{restaurantId:1,restaurantName:"unassigned Restaurant 1"},{restaurantId:2,restaurantName:"unassigned Restaurant 1"}];

    /* loadRoles();*/

    $scope.searchQueryAvailableRole = '';
    $scope.searchQueryAssignRole = '';

    /* function loadRoles() {
     var reqJSON = {
     orgId: authResponse.organizationData.orgId,
     authObj: {
     "functionId": FKey.ADD_EMPLOYEE_TO_USER_ROLE.FUNCTION_ID,
     "moduleId": RKey.SECURITY_SERVICE.SERVICE_ID,
     "requestId": RKey.SECURITY_SERVICE.FUNCTION.GET_ENTITLEMENT_ORG_ROLES,
     "userToken": authResponse.token,
     "userName": authResponse.userData.userName,
     "orgId": authResponse.userData.organizationId,
     "branchId": authResponse.userData.branchId
     }
     };
     comSrv.postCall('/', reqJSON, function (status, data) {
     if (status == 200 || status == 201) {
     removeDefault(data);
     loadAssignRoles();
     } else {
     if (data.Error == 3) {
     comSrv.popMessage(data.rejectMessage, 'note');
     } else if (status == 500) {
     comSrv.popMessage('Internal server error', 'error');
     }
     }
     });
     };*/

    /*function removeDefault(data) {
     //$scope.enModalOptions.assignRoles = loadAssignRoles();
     if (data) {
     _.each(data, function (r) {
     if (!r.sysDefault) {
     $scope.enModalOptions.roleLists.push(r);
     }
     });
     } else {
     _.each($scope.enModalOptions.assignRoles, function (ar) {
     for (var x = 0; x < $scope.enModalOptions.roleLists.length; x++) {
     if ($scope.enModalOptions.roleLists[x].roleId == ar.roleId) {
     $scope.enModalOptions.roleLists.splice(x, 1);
     --x;
     }
     }
     });
     }

     };*/

    $scope.enModalOptions.addingItems = function (remvArray, addArray, all) {
        if (all) {
            _.each(remvArray, function (r) {
                r.cheked = true;
            });
        }
        for (var x = 0; x < remvArray.length; x++) {
            if (remvArray[x].cheked) {
                addArray.push(remvArray[x]);
                remvArray[x].cheked = false;
                remvArray.splice(x, 1);
                --x;
            }
        }
    };

    $scope.enModalOptions.removingItems = function (addArray, remvArray, all) {
        if (all) {
            _.each(remvArray, function (r) {
                r.cheked = true;
            });
        }
        //console.log(remvArray)
        for (var x = 0; x < remvArray.length; x++) {
            if (remvArray[x].cheked) {
                addArray.push(remvArray[x]);
                remvArray[x].cheked = false;
                remvArray.splice(x, 1);
                --x;
            }
        }
    };

    /* $scope.enModalOptions.addUpdateEntitlement = function () {
     var sendList = [];
     _.each($scope.enModalOptions.assignRoles, function (f) {
     delete f.cheked;
     // delete f.createdBy;
     // delete f.isDefault;
     // delete f.orgId;
     sendList.push(f);
     });

     var reqJSON = {
     "userName": user.userName,
     "roleObj": sendList,
     authObj: {
     "functionId": FKey.ADD_EMPLOYEE_TO_USER_ROLE.FUNCTION_ID,
     "moduleId": RKey.SECURITY_SERVICE.SERVICE_ID,
     "requestId": RKey.SECURITY_SERVICE.FUNCTION.PUT_ENTITLEMENT_ASSIGN_USER_ROLES,
     "userToken": authResponse.token,
     "userName": authResponse.userData.userName,
     "orgId": authResponse.userData.organizationId,
     "branchId": authResponse.userData.branchId
     }
     };
     console.log(reqJSON.roleObj);
     comSrv.postCall('/', reqJSON, function (status, data) {
     if (status == 200 || status == 201) {
     comSrv.popMessage('Successfully Updated', 'success');
     $scope.enModalOptions.close();
     } else {
     if (data.Error == 3) {
     comSrv.popMessage(data.rejectMessage, 'note');
     } else if (status == 500) {
     comSrv.popMessage('Internal server error', 'error');
     }
     $scope.enModalOptions.close();
     }
     });
     };*/

    /* $scope.clickItems = function (checkStatus, item) {
     if (checkStatus) {
     item.selected = true;
     } else {
     item.selected = false;
     }
     $scope.checkBox = true;
     _.each($scope.discountGroups, function (opt) {
     if (opt.selected) {
     $scope.checkBox = false;
     }
     });
     };*/

    /* function loadAssignRoles() {
     var reqJSON = {
     userName: user.userName,
     authObj: {
     "functionId": FKey.ADD_EMPLOYEE_TO_USER_ROLE.FUNCTION_ID,
     "moduleId": RKey.SECURITY_SERVICE.SERVICE_ID,
     "requestId": RKey.SECURITY_SERVICE.FUNCTION.GET_ENTITLEMENT_USER_ROLES,
     "userToken": authResponse.token,
     "userName": authResponse.userData.userName,
     "orgId": authResponse.userData.organizationId,
     "branchId": authResponse.userData.branchId
     }
     };
     comSrv.postCall('/', reqJSON, function (status, data) {
     if (status == 200 || status == 201) {
     $scope.enModalOptions.assignRoles = data;
     removeDefault();
     } else {
     if (data.Error == 3) {
     comSrv.popMessage(data.rejectMessage, 'note');
     } else if (status == 500) {
     comSrv.popMessage('Internal server error', 'error');
     }
     $scope.enModalOptions.assignRoles = [];
     removeDefault();
     }
     });
     };*/
    /* };*/

}

function logoutController($scope, $state, $http, $location, comSrv) {
    logout();
    function logout() {
        localStorage.clear();
        window.location = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/login";
    }

};