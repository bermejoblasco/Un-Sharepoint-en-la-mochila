angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $state) {
    $scope.registerPush = function () {
        var client = new WindowsAzure.MobileServiceClient('YourURLAzureMobileApp');
        var pushOptions = {
            android: {
                senderID: 'Your SenderId'
            },
            ios: {
                alert: true,
                badge: true,
                sound: true
            },
            windows: {
            }
        };

        pushHandler = PushNotification.init(pushOptions);


        pushHandler.on('registration', function (data) {
            NProgress.start();
            registrationId = data.registrationId;
            // For cross-platform, you can use the device plugin to determine the device
            // Best is to use device.platform
            var name = 'gcm'; // For android - default
            if (device.platform.toLowerCase() === 'ios')
                name = 'apns';
            if (device.platform.toLowerCase().substring(0, 3) === 'win')
                name = 'wns';
            client.push.register(name, data.registrationId);
            NProgress.done();
        });

        pushHandler.on('notification', function (data) {
            // data is an object and is whatever is sent by the PNS - check the format
            // for your particular PNS
            alert("Notification: " + data.message)
        });

        pushHandler.on('error', function (error) {
            // Handle errors
            alert("error push: " + error)
        });
    };
})
.controller('LoginCtrl', function ($scope) {
    $scope.islogin = false;
    $scope.signIn = function () {
        var authContext = new O365Auth.Context();
        NProgress.start();
        authContext.getIdToken("https://outlook.office365.com/")
       .then((function (token) {
           // Get auth token
           authtoken = token;
           // Get user name from token object.
           userName = token.givenName + " " + token.familyName;
           $scope.islogin = true;
           NProgress.done();
       }), function (error) {
           // Log sign-in error message.
           alert('Failed to login. Error = ' + error.message);
           console.log('Failed to login. Error = ' + error.message);
           NProgress.done();
       });
    };
})
.controller('LogoutCtrl', function ($scope) {
    $scope.islogout = false;
    $scope.signOut = function () {
        var authContext = new O365Auth.Context();
        NProgress.start();
        authContext.logOut("yourClientId")
            .then((function () {
                $scope.islogout = true;
                console.log("logout ok");
                NProgress.done();
            }), function (error) {
                // Log sign-in error message.
                $scope.islogout = false;
                console.log("logout ko");
                NProgress.done();
            });
    };
})

.controller('doclistsCtrl', function ($scope, $cordovaFileTransfer, $cordovaFileOpener2, $http, $cordovaInAppBrowser, $ionicModal, $sce) {
    var authContext = new O365Auth.Context();
    $scope.doclists = new Array();
    authContext.getAccessToken("https://yourOffice365domain")
        .then((function (authtoken) {
            NProgress.start();
            $http({
                method: 'GET',
                url: "https://yourOffice365domain/_api/web/lists/getByTitle(" + "'Documentos'" + ")/items?$expand=File",
                headers: {
                    "Accept": "application/json;odata=verbose",
                    "Authorization": "Bearer " + authtoken,
                    "content-type": "application/json;odata=verbose"
                }
            }).success(function (data, status, headers, config) {
                angular.forEach(data.d.results, function (file) {
                    $scope.doclists.push({
                        title: file.File.Name,
                        image: getImage(file.File.Name.substring(file.File.Name.lastIndexOf("."))),
                        url: file.ServerRedirectedEmbedUrl
                    })
                    NProgress.done();
                });                
            }).error(function (data, status, headers, config) {
                NProgress.done();
                alert("error: " + data)
            });

        }), function (error) {
            // Log sign-in error message.
            console.log('Failed to login. Error = ' + error.message);
        });
   
    $scope.openModal = function (url) {
        window.open(url, "_blank", "location=yes");
    };    

    function getImage(extension) {
        switch (extension) {
            case ".pdf":
                return 'data:image/png;base64,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'
            case ".doc":
            case ".docx":
                return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAQbSURBVEhL1ZZ/TJR1HMffd94dx4EHCO4QHVCCCOhxBAwFbA4IAwprlrKlbJZ/9YtVtlz9Uat/mktrrVq/qK10jhyswpqzbFNEK2cpM1lnUSMZLhQ0D+7H89zR5/PluZOH+8mx5Xqx757v9/t8uffzeb6fz/v7aFa1vjuFW4BWuf7n/L+Efb4peCQvJpweTLokZXZuRBX2en1wuWXcmHRj7B8nRq444KB+dmYK2pqseKSlNC7xoORye2S4qEmyDw76wVwSKC3IhK3AgjtW8DUTqclGZTXQb7+M+if2q+Zmo9NpsUCrjlElzKIVxUvRXJMHW74FRbctVu6Ep+/sEJ5+81vkLEkVWzAbPYna/7wKp0dSiauEr91w4e1dTWipyVdmonP45G9YaDKg2patzATT03cRj736NVJmvBWdcg3gpP2cC4kJOrzVdQZ954ch0/b48VL0ZpMe7a2VcLpkTM16GfMuJw39yZThbrdEW6VunCtM8AaEiDgWrlx3YuCPUayj1+uWZGypL8QD9cUUsVdZMU2oPfcTNuJXOnqx6bmDon/s5yFoSl5E13cDYty+5zAe3NUl+mZTAra93INFDXuwuPGNQEtr2AvrQx+INaEIG/HKnHTs3ndK9E//MoyU9GScHhjBptpCnP99FJvvKhL3xh0unHivDWWFWWIcK2GFK1ctg+PapOhzxE3VeeIBGPvQVTy/vUb0U5IS0LLzIBaZE+GbkUFsPJa0JBx7v02ZURNWODvTDAOVyej4BE5QrR6nqEq3dYh7LqeMurIc0Z8gk3lpRw3uW79S7HcAfgaNZrofgohZbV1hwcdf9cOgX4DVeRYyAOCTQ2dhogfKoGgYPU3+eGEEnx+3o6f3YqB90WvHNz8MijWhiChcV5aLfYfOobY8V4zZyd7p/gmNVbeLMaPVavD32AQG/xrD4PD4zXZpHEMj15VVwUQspxLy5d2fnsLWe0rEuKJ4CTqPXMDm+unEYthwdmy04d47C5SZ2Igo3LhmOZ7dugYb101baHNVPk6eG0YtvQk/Zkqu9Y92wmign5pRtjIlV1ZGMuzdjyszaoK8+rWnGrClrlCZiQ57dUaqCeVF4cup8+gAdr5+BKkLb3r1vC2TDaT1hW6sffgjVG7vCLTytg/R+OR+ZVUw8474KGXumV8v4+6q5eKrxA+XtI4yns/yz8jxntkbJWI+beaCRHu5dvUyWKncysm9/K2CXj2LMlzNmlk1HeJDIAvN1fmwUQ3H8iHwff8l3E+enm42Bh19DJfbJGU+BzRTXCXMxPPps6H9ANJIOBxaEowYcSjYc/khJK9XXN0eL0xGHQpyMlBtXUqupkPHl+RmRr3yH7ERVTgUfM5ynUp0/nIkcxVl4ion3jf276REQ1yizLzrOF5ukTDwL28GoqxlAuZkAAAAAElFTkSuQmCC'
            case ".xls":
            case ".xlsx":
                return 'data:image/png;base64,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'
            default:
                return ''
        }
    }

    function getContentType(extension) {
        switch (extension) {
            case ".pdf":
                return "application/pdf"
            case ".doc":
                return "application/ms-word"
            case ".docx":
                return "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            case ".xls":
                return "application/vnd.ms-excel"
            case ".xlsx":
                return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            default:
                return ''
        }
    }
})