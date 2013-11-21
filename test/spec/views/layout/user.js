(function() {
	'use strict';

	var root = this;

	root.define([
		'views/layout/user'
		],
		function( User ) {

			describe('User Layout', function () {

				it('should be an instance of User Layout', function () {
					var user = new User();
					expect( user ).to.be.an.instanceof( User );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );