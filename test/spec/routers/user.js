(function() {
	'use strict';

	var root = this;

	root.define([
		'routers/user'
		],
		function( User ) {

			describe('User Router', function () {

				it('should be an instance of User Router', function () {
					var user = new User();
					expect( user ).to.be.an.instanceof( User );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );