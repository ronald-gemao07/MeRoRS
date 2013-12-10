$(document).ready(function() {

    // Hide Error Messages
    $(".error-message").hide();

    //login validations
    $('#loginForm').ajaxForm({

        beforeSubmit: function(formData, jqForm, options) {
            $('.error-message').hide();

            var email = $("input#inputEmail").val();

            var emailStatus = checkEmail(email);

            if ( emailStatus != "Valid" ) {
                $(".error-message").text(emailStatus);
                $(".error-message").show();
                $("input#inputEmail").focus();
                return false;
            }

            var password = $("input#inputPassword").val();

            if (password == "") {
                $(".error-message").text("Please enter password.");
                $(".error-message").show();
                $("input#inputPassword").focus();
                return false;
            }
        },

        success: function(responseText, status, xhr, $form) {
            window.location.replace("/app");
            return false;
        },

        error: function(responseText, status, xhr, $form) {
            $(".error-message").text("Email and password do not match.");
            $(".error-message").show();
            $("input#inputEmail").focus();
            return false;
        }
    });
    // end of #loginForm function

    // Signup Form Validation
    $('#signupForm').ajaxForm({

        beforeSubmit: function(formData, jqForm, options) {
            $('.error-message').hide();

            var email = $("input#inputEmail").val();

            var emailStatus = checkEmail(email);

            if ( emailStatus != "Valid" ) {
                $(".error-message").text(emailStatus);
                $(".error-message").show();
                $("input#inputEmail").focus();
                return false;
            }

            var password = $("input#inputPassword").val();

            if (password == "") {
                $(".error-message").text("Please enter password.");
                $(".error-message").show();
                $("input#inputPassword").focus();
                return false;
            }

            var password2 = $("input#confirmPassword").val();

            if (password2 == "") {
                $(".error-message").text("Please retype password.");
                $(".error-message").show();
                $("input#confirmPassword").focus();
                return false;
            }

            if (password2 !== password) {
                $(".error-message").text("Password do not match.");
                $(".error-message").show();
                $("input#inputPassword").focus();
                return false;
            }

            if (password.length < 6){
                $(".error-message").text("Password length should be at least 6 characters.");
                $(".error-message").show();
                $("input#inputPassword").focus();
                return false;
            }

        },

        success: function(responseText, status, xhr, $form) {
            window.location.replace("/app");
            return false;
        },

        error: function(responseText, status, xhr, $form) {
            $(".error-message").text("Signup Error: Email already in use.");
            $(".error-message").show();
            $("input#inputEmail").focus();
            return false;
        }
    });

// Reset password

	$('#forgotPassword').ajaxForm({

        beforeSubmit: function(formData, jqForm, options) {
            $('.error-message').hide();

            var email = $("input#inputEmail").val();

            var emailStatus = checkEmail(email);

            if ( emailStatus != "Valid" ) {
            	$(".error-message").removeClass("btn-warning").addClass("btn-danger");
                $(".error-message").text(emailStatus);
                $(".error-message").show();
                $("input#inputEmail").focus();
                return false;
            }
        },

        success: function(responseText, status, xhr, $form) {
        	$("input#inputEmail").hide();
        	$(".btn").hide();
        	$(".error-message").removeClass("btn-danger").addClass("btn-warning");
        	$(".error-message").text("Instructions on how to reset your password will be sent to your email.");
            $(".error-message").fadeIn("slow");
            return false;
        },

        error: function(responseText, status, xhr, $form) {
        	$(".error-message").removeClass("btn-warning").addClass("btn-danger");
            $(".error-message").text("Invalid Email.");
            $(".error-message").show();
            $("input#inputEmail").focus();
            return false;
        }
    });
    // end of #forgotPassword function

});
// End Document Ready


function checkEmail(email) {
    if(email == ""){
    	return "Please enter email.";
    }

    else if(!validateEmail(email)){
    	return "Not a valid Global Zeal, Inc. email.";
    }

    else{
    	return "Valid";
    }
}

function validateEmail(email) {
    var regExPattern = /[a-zA-Z]{1,20}\.[a-zA-Z]{1,20}@globalzeal\.net$/i;
    return regExPattern.test(email);
}