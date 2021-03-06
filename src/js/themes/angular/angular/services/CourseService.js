angular.module('app').service('CourseDataService',['$http', '$rootScope', 'HttpService', '$q', 'RandomDataGeneratorService' , '$state',function ($http, $rootScope, HttpService, $q, RandomDataGeneratorService, $state) {

    var courses = new Object({});
    var dataFetched = false;
    var fetchedCourseId ='';
    var course = new Object({});
    var courseStudents = new Object({});

    var getAllCourses = function () {  
        var deferred = $q.defer();
        if(dataFetched){
            deferred.resolve(courses);
        } else{
            HttpService.get('/courses', {
                    "data": null
            }).then(function(data){
                    courses = data;
                    courses.forEach(function(e){
                        
                        //TODO: set TA's, cover photo and instructors image
                        e.image = RandomDataGeneratorService.personImagePicker();
                        e.icon = RandomDataGeneratorService.courseIconPicker();
                        e.backgroundColor = RandomDataGeneratorService.courseBackgroundColorPicker();
                    });
                    deferred.resolve(courses);
                });
            dataFetched = true;
        }
        return deferred.promise;

    };

    var getCourseForID = function (courseId) {
        var deferred = $q.defer();
        HttpService.get('/courses/' + courseId.replace(/"/g , ""), {  
            "data": null
        }, false, false, false).then(function(data){
                course = data;
                //TODO: add images for TA's inside the loop
                var courseInstructors = course.instructors;
                if(courseInstructors){
                    courseInstructors.forEach(function(e){
                        e.image = RandomDataGeneratorService.personImagePicker();
                    });
                }
                TA = [];
                TA.push({"name": "James Smith", "image": RandomDataGeneratorService.personImagePicker()},
                    {"name": "Mary Anderson", "image": RandomDataGeneratorService.personImagePicker()}
                );              

                course.tas = TA;
                
                course.coverImage = "images/course-cover/computer-3.jpg";
                deferred.resolve(course);   
            });
        return deferred.promise;  
    };

    var createNewCourse = function (data, instructorId) {
        var deferred = $q.defer();
        HttpService.post('/instructors/' + instructorId.replace(/"/g , "") + '/addCourse', data).then(function(response){
            $rootScope.addingNewCourse = false;
            $state.go('website-student.courses');
            deferred.resolve(response);
        }, function(err){
            $rootScope.addingNewCourse = false;
            $state.go('website-student.courses');
        });
        return deferred.promise;
    };

    var registerCourseForStudent = function(studentId, courseId){
        var deferred = $q.defer();
        HttpService.get('/students/' + studentId.replace(/"/g, "") +'/addCourse/' + courseId.replace(/"/g , ""), {  
            "data": null
        }, false, false, false).then(function(data){
                deferred.resolve(course);   
            });
        return deferred.promise;  
    };


    var getCourseStudents = function (courseId) {  
        var deferred = $q.defer();
        HttpService.get('/courses/' + courseId + '/students', {
                "data": null
        }).then(function(data){
            courseStudents = data;
            deferred.resolve(courseStudents);
           
        });
        return deferred.promise;
    };

  
    return {
        getAllCourses: getAllCourses, 
        getCourseForID: getCourseForID,
        createNewCourse: createNewCourse, 
        registerCourseForStudent: registerCourseForStudent, 
        getCourseStudents: getCourseStudents
    };
      
}]);   


