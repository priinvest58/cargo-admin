var priApp = angular.module('priApp', ['angularMoment']);

priApp.run([
    '$rootScope',
    '$window',
    function($rootScope, $window) {
        var firebaseConfig = {
            apiKey: "AIzaSyDOPOvzqM-9mcc9LusEVgVGLjOSbPtznD0",
            authDomain: "cargo-b06db.firebaseapp.com",
            projectId: "cargo-b06db",
            storageBucket: "cargo-b06db.appspot.com",
            messagingSenderId: "347536480650",
            appId: "1:347536480650:web:51081fac316e7db1ee5073",
            measurementId: "G-9ERFDC3CWQ"
        };
        // Initialize Firebase
        try {
            $window.firebase.initializeApp(firebaseConfig);
            $window.firebase.analytics();
            $rootScope.db = firebase.firestore();
            $rootScope.storage = firebase.storage();
        } catch (error) {}
    },
]);

priApp.controller('MainController', function(
    $scope,
    moment,
    $window,
    $rootScope,
    $timeout
) {
    $scope.user = {};
    $scope.percels = [];
    loadParcels();

    $scope.onDelete = function(p) {

        if (confirm("Are you sure, you want to delete the Percel?")) {
            $rootScope.db
                .collection('Parcels')
                .doc(`${p.id}`)
                .delete()
                .then(() => {
                    loadParcels();


                })
                .catch(error => {
                    alert('Error deleting document: ', error);
                });

        }


    }

    $scope.onEdit = function(p) {

        $window.localStorage.setItem("p", JSON.stringify(p));

        $window.location.href = "editParsel.html";


    }

    $scope.submitForm = function() {
        var guid = createGuid();
        $rootScope.db
            .collection('Parcels')
            .doc(`${guid}`)
            .set({
                id: `${ guid}`,
                senderName: `${$scope.user.senderName}`,
                receiverName: `${$scope.user.receiverName}`,
                itemDetails: `${$scope.user.itemDetails}`,
                rPhoneNumber: `${$scope.user.rPhoneNumber}`,
                weight: `${$scope.user.weight}`,
                addInfo: `${$scope.user.addInfo}`,
                status: `${$scope.user.status}`,
                trackingNumber: `${$scope.user.trackingNumber}`,
                from: `${$scope.user.from}`,
                to: `${$scope.user.to}`,
                deliveryDate: `${$scope.user.deliveryDate}`,
            })
            .then(() => {
                $scope.user = {};
                alert(`Parcel was created successfully!`);
                $window.location.href = "./dashboard.html";

            })
            .catch(error => {
                console.error('Error adding document: ', error);
            });
    }




    function createGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function loadParcels() {

        try {
            $rootScope.db.collection('Parcels').get().then(result => {
                const data = result.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));



                $scope.$apply(function() {
                    $scope.percels = data;
                    console.log(data);


                });
            });

        } catch (error) {

        }

    }

});

priApp.controller('LoginController', function(
    $scope,
    moment,
    $window,
    $rootScope,
    $timeout
) {


    $scope.user = {};

    $scope.login = function() {
        console.log($scope.user);

        if ($scope.user.username === "admin" || $scope.user.password === "12345") {

            $window.localStorage.setItem("user", "1");
            $window.location.href = "./dashboard.html";

        } else {

            alert("Invalid username or password");

        }


    }


    function loadCategoriesFromServer() {
        try {
            $rootScope.db.collection('categories').get().then(result => {
                const data = result.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                $scope.$apply(function() {
                    $scope.categories = data;

                });
                console.log('All numbers in collections', data);
            });
        } catch (error) {

        }
    };

    $scope.checkCatItems = function(cat) {

        $window.localStorage.setItem("currentCat", JSON.stringify(cat));
        console.log(cat);
        $window.location.href = "./main_cat.html";

    }


    $scope.submitForm = function() {

        var guid = createGuid();

        $rootScope.db
            .collection('categories')
            .doc(`${guid}`)
            .set({
                id: `${ guid}`,
                name: `${$scope.form.name}`,
            })
            .then(() => {
                $scope.form.name = "";
                loadNumbersFromServer();
                alert(`Created!`);

            })
            .catch(error => {
                console.error('Error adding document: ', error);
            });


    };



    function loadProducts() {
        try {
            $rootScope.db.collection('products').where("categoryID", "==", $scope.cat.id).get().then(result => {
                const data = result.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));



                $scope.$apply(function() {
                    $scope.products = data;

                });
                console.log('All numbers in collections', data);
            });
        } catch (error) {

        }
    };

    function createGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

});
priApp.controller('EditController', function(
    $scope,
    moment,
    $window,
    $rootScope,
    $timeout
) {


    $scope.user = {};

    loadParcel();




    function loadParcel() {
        try {

            $scope.user = JSON.parse($window.localStorage.getItem("p"));
            console.log($scope.user);

        } catch (error) {

        }
    };

    $scope.checkCatItems = function(cat) {

        $window.localStorage.setItem("currentCat", JSON.stringify(cat));
        console.log(cat);
        $window.location.href = "./main_cat.html";

    }


    $scope.updateForm = function() {


        $rootScope.db
            .collection('Parcels')
            .doc(`${$scope.user.id}`)
            .set({
                id: `${$scope.user.id}`,
                senderName: `${$scope.user.senderName}`,
                receiverName: `${$scope.user.receiverName}`,
                itemDetails: `${$scope.user.itemDetails}`,
                rPhoneNumber: `${$scope.user.rPhoneNumber}`,
                weight: `${$scope.user.weight}`,
                addInfo: `${$scope.user.addInfo}`,
                status: `${$scope.user.status}`,
                trackingNumber: `${$scope.user.trackingNumber}`,
                from: `${$scope.user.from}`,
                to: `${$scope.user.to}`,
                deliveryDate: `${$scope.user.deliveryDate}`,
            })
            .then(() => {
                $scope.user = {};
                alert(`Parcel was updated successfully!`);
                $window.location.href = "./dashboard.html";

            })
            .catch(error => {
                console.error('Error adding document: ', error);
            });


    };







});