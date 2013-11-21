(function() {
	'use strict';

	var root = this;

	root.define([
		'collections/users'
		],
		function( Users ) {

			describe('Users Collection', function () {

				it('should be an instance of Users Collection', function () {
					var users = new Users();
					expect( users ).to.be.an.instanceof( Users );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );