(function() {
	'use strict';

	var root = this;

	root.define([
		'views/view-name'
		],
		function( ViewName ) {

			describe('ViewName View', function () {

				it('should be an instance of ViewName View', function () {
					var view-name = new ViewName();
					expect( view-name ).to.be.an.instanceof( ViewName );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );