/**
 * @author zz85 / https://github.com/zz85
 * Parametric Surfaces Geometry
 * based on the brilliant article by @prideout http://prideout.net/blog/?p=44
 *
 * new THREE.ParametricGeometry( parametricFunction, uSegments, ySegements );
 *
 */

THREE.ParametricGeometry = function ( func, slices, stacks ) {

	THREE.Geometry.call( this );

	this.type = 'ParametricGeometry';

	this.parameters = {
		func: func,
		slices: slices,
		stacks: stacks
	};

	this.updateSurface();

};

THREE.ParametricGeometry.prototype = Object.create( THREE.Geometry.prototype );

THREE.ParametricGeometry.prototype.updateSurface = function() {

	var verts = this.vertices;
	var faces = this.faces;
	var uvs = this.faceVertexUvs[ 0 ];
	var func = this.parameters.func;
	var slices = this.parameters.slices;
	var stacks = this.parameters.stacks;
	var i, il, j, p;
	var u, v;

	var stackCount = stacks + 1;
	var sliceCount = slices + 1;
	var vertIndex = 0;
	for ( i = 0; i <= stacks; i ++ ) {

		v = i / stacks;

		for ( j = 0; j <= slices; j ++ ) {

			u = j / slices;

			p = func( u, v );
			verts[vertIndex++] = p;

		}
	}

	var a, b, c, d;
	var uva, uvb, uvc, uvd;
	var faceIndex = 0;
	for ( i = 0; i < stacks; i ++ ) {

		for ( j = 0; j < slices; j ++ ) {

			a = i * sliceCount + j;
			b = i * sliceCount + j + 1;
			c = (i + 1) * sliceCount + j + 1;
			d = (i + 1) * sliceCount + j;

			uva = new THREE.Vector2( j / slices, i / stacks );
			uvb = new THREE.Vector2( ( j + 1 ) / slices, i / stacks );
			uvc = new THREE.Vector2( ( j + 1 ) / slices, ( i + 1 ) / stacks );
			uvd = new THREE.Vector2( j / slices, ( i + 1 ) / stacks );

			faces[faceIndex++] = new THREE.Face3( a, b, d );
			uvs[faceIndex] = [ uva, uvb, uvd ];

			faces[faceIndex++] = new THREE.Face3( b, c, d );
			uvs[faceIndex] = [ uvb.clone(), uvc, uvd.clone() ];

		}

	}

	// console.log(this);

	// magic bullet
	// var diff = this.mergeVertices();
	// console.log('removed ', diff, ' vertices by merging');

	this.computeFaceNormals();
	this.computeVertexNormals();

	this.verticesNeedUpdate = true;
	this.elementsNeedUpdate = true;
}
