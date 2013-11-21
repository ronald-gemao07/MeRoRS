(function() {
	'use strict';

	var root = this;

	root.define([
		'views/composite/userview'
		],
		function( Userview ) {

			describe('Userview Compositeview', function () {

				it('should be an instance of Userview Compositeview', function () {
					var userview = new Userview();
					expect( userview ).to.be.an.instanceof( Userview );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );