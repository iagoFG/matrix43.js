/// matrix43.js
/// A 3D transformations matrix library both compatible with HTML Canvas and libraries like PixiJS
/// This library uses 4x3 matrices because fourth row is not needed for canvas/pixi applications (it is assumed always as 0 0 0 1).
/// @site http://iagofg.com/m4canvas
/// @author info@iagofg.com
/// @license LGPL2
"use strict";
(function() {
	var $m43 = {};

	/// Chains a set of matrices and returns the resulting matrix.
	/// argument ... all the matrices to be chained, from left to right.
	/// returns the resulting transformation matrix.
	function m4chain() {
		var m = arguments[0];
		for (var i = 1; i < arguments.length; ++i) {
			m = m4mul(arguments[i], m);
		}
		return m;
	}
	$m43.chain = m4chain;
	
	/// Returns a clone of the passed matrix.
	/// argument A a matrix to clone.
	/// returns the cloned matrix.
	function m4clone(A) {
		return [
			A[0],  A[1],  A[2],  A[3],
			A[4],  A[5],  A[6],  A[7],
			A[8],  A[9],  A[10], A[11]
		];
	}
	$m43.clone = m4clone;

	/// Sets all the elements into a new matrix.
	/// argument ... the rows and column numbers to compose the matrix.
	/// returns the composed matrix.
	function m4set(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34) {
		return [
			m11, m12, m13, m14,
			m21, m22, m23, m24,
			m31, m32, m33, m34
		];
	}
	$m43.set = m4set;

	/// Returns the inverted matrix, fast calculation only for valid for homogeneus matrices.
	/// argument A a matrix to invert.
	/// returns the inverted matrix.
	function m4invh(A) {
		return [
			A[0], A[4],  A[8], -A[0] * A[3] - A[4] * A[7] -  A[8] * A[11],
			A[1], A[5],  A[9], -A[1] * A[3] - A[5] * A[7] -  A[9] * A[11],
			A[2], A[6], A[10], -A[2] * A[3] - A[6] * A[7] - A[10] * A[11]
		];
	}
	$m43.invh = m4invh;

	/// Returns the inverted matrix for all 4x3 invertible matrices.
	/// It works with 4x3 matrices as long as invert a matrix whose last row is 0 0 0 1 returns an inverse which keeps the last row as 0 0 0 1.
	/// argument A a matrix to invert.
	/// returns the inverted matrix, or false if not inversible
	/// @note inspired in https://stackoverflow.com/questions/1148309/inverting-a-4x4-matrix
	function m4inverse(A) {
		var inv = [];
		inv[0] =  A[5] * A[10] -
							A[9] * A[6];
		inv[4] = -A[4] * A[10] +
							A[8] * A[6];
		inv[8] =  A[4] * A[9] -
							A[8] * A[5];
		inv[1] = -A[1] * A[10] +
							A[9] * A[2];
		inv[5] =  A[0] * A[10] -
							A[8] * A[2];
		inv[9] = -A[0] * A[9] +
							A[8] * A[1];
		inv[2] =  A[1] * A[6] -
							A[5] * A[2];
		inv[6] = -A[0] * A[6] +
							A[4] * A[2];
		inv[10] = A[0] * A[5] -
							A[4] * A[1];
		inv[3] = -A[1] * A[6] * A[11] +
							A[1] * A[7] * A[10] +
							A[5] * A[2] * A[11] -
							A[5] * A[3] * A[10] -
							A[9] * A[2] * A[7] +
							A[9] * A[3] * A[6];
		inv[7] =  A[0] * A[6] * A[11] -
							A[0] * A[7] * A[10] -
							A[4] * A[2] * A[11] +
							A[4] * A[3] * A[10] +
							A[8] * A[2] * A[7] -
							A[8] * A[3] * A[6];
		inv[11] = -A[0] * A[5] * A[11] +
							 A[0] * A[7] * A[9] +
							 A[4] * A[1] * A[11] -
							 A[4] * A[3] * A[9] -
							 A[8] * A[1] * A[7] +
							 A[8] * A[3] * A[5];
		det = A[0] * inv[0] + A[1] * inv[4] + A[2] * inv[8];
		if (det == 0) return false;
		det = 1.0 / det;
		for (i = 0; i < 11; i++) inv[i] *= det;
		return inv;
	}
	$m43.inverse = m4inverse;

	/// Multiplies two homogeneus matrices. Remember matrix multiplication is not conmutative.
	/// argument A the first matrix to multiply.
	/// argument B the second matrix to multiply.
	/// returns the A*B result.
	function m4mul(A, B) {
		return [
			A[0] * B[0] + A[1] * B[4] + A[2] * B[8], A[0] * B[1] + A[1] * B[5] + A[2] * B[9], A[0] * B[2] + A[1] * B[6] +  A[2] * B[10], A[0] * B[3] + A[1] * B[7] +  A[2] * B[11] +  A[3],
			A[4] * B[0] + A[5] * B[4] + A[6] * B[8], A[4] * B[1] + A[5] * B[5] + A[6] * B[9], A[4] * B[2] + A[5] * B[6] +  A[6] * B[10], A[4] * B[3] + A[5] * B[7] +  A[6] * B[11] +  A[7],
			A[8] * B[0] + A[9] * B[4] + A[10]* B[8], A[8] * B[1] + A[9] * B[5] + A[10]* B[9], A[8] * B[2] + A[9] * B[6] + A[10] * B[10], A[8] * B[3] + A[9] * B[7] + A[10] * B[11] + A[11]
		];
		//return m4multiply(A, B);
		//return [
		//	A[0] * B[0] + A[1] * B[4] +  A[2] * B[8], A[0] * B[1] + A[1] * B[5] +  A[2] * B[9], A[0] * B[2] + A[1] *B[6] +  A[2] * B[10], 0.0,
		//	A[4] * B[0] + A[5] * B[4] +  A[6] * B[8], A[4] * B[1] + A[5] * B[5] +  A[6] * B[9], A[4] * B[2] + A[5] *B[6] +  A[6] * B[10], 0.0,
		//	A[8] * B[0] + A[9] * B[4] + A[10] * B[8], A[8] * B[1] + A[9] * B[5] + A[10] * B[9], A[8] * B[2] + A[9] *B[6] + A[10] * B[10], 0.0
		//];
	}
	$m43.mul = m4mul;

	/// Multiplies two matrices. Remember matrix multiplication is not conmutative.
	/// argument A the first matrix to multiply.
	/// argument B the second matrix to multiply.
	/// returns the A*B result.
	function m4multiply(A, B) {
		return [
			A[0] * B[0] + A[1] * B[4] + A[2] * B[8], A[0] * B[1] + A[1] * B[5] + A[2] * B[9], A[0] * B[2] + A[1] * B[6] +  A[2] * B[10], A[0] * B[3] + A[1] * B[7] +  A[2] * B[11] +  A[3],
			A[4] * B[0] + A[5] * B[4] + A[6] * B[8], A[4] * B[1] + A[5] * B[5] + A[6] * B[9], A[4] * B[2] + A[5] * B[6] +  A[6] * B[10], A[4] * B[3] + A[5] * B[7] +  A[6] * B[11] +  A[7],
			A[8] * B[0] + A[9] * B[4] + A[10]* B[8], A[8] * B[1] + A[9] * B[5] + A[10]* B[9], A[8] * B[2] + A[9] * B[6] + A[10] * B[10], A[8] * B[3] + A[9] * B[7] + A[10] * B[11] + A[11]
		];
	}
	$m43.mult2 = m4multiply;

	/// Returns the identity matrix.
	/// argument none
	/// returns an identity matrix.
	function m4one() {
		return [
			1.0, 0.0, 0.0, 0.0,
			0.0, 1.0, 0.0, 0.0,
			0.0, 0.0, 1.0, 0.0
		];
	}
	$m43.one = m4one;

	/// Returns a random matrix, values between max and min.
	/// argument max, min
	/// returns an identity matrix.
	function m4rand(max, min) {
		if (max === undefined) max = 1.0;
		if (min === undefined) min = 0.0;
		var delta = max - min;
		return [
			Math.random() * delta + min, Math.random() * delta + min, Math.random() * delta + min, Math.random() * delta + min,
			Math.random() * delta + min, Math.random() * delta + min, Math.random() * delta + min, Math.random() * delta + min,
			Math.random() * delta + min, Math.random() * delta + min, Math.random() * delta + min, Math.random() * delta + min
		];
	}
	$m43.rand = m4rand;

	/// Returns the zero matrix.
	/// argument none
	/// returns an zeroed matrix.
	function m4zero() {
		return [
			0.0, 0.0, 0.0, 0.0,
			0.0, 0.0, 0.0, 0.0,
			0.0, 0.0, 0.0, 0.0
		];
	}
	$m43.zero = m4zero;

	/// Returns a translation matrix.
	/// argument x the x component for the translation.
	/// argument y the y component for the translation.
	/// argument z the z component for the translation.
	/// returns the translation matrix.
	function m4mov(x, y, z) {
		return [
			1.0, 0.0, 0.0, x,
			0.0, 1.0, 0.0, y,
			0.0, 0.0, 1.0, z
		];
	}
	$m43.mov = m4mov;
	//????

	/// Returns a scale matrix.
	/// argument x (mandatory) the scale in the x component or in the x, y, z components.
	/// argument y (optional) the scale in the y component.
	/// argument z (optional) the scale in the z component.
	/// returns the scale matrix.
	function m4scale(x, y, z) {
		if (x === undefined) x = 1.0;
		if (y === undefined) y = x; // if no second parameter is set, use first as second as well
		if (z === undefined) z = y; // if no third parameter is set, use second as third as well
		return [
				x, 0.0, 0.0, 0.0,
			0.0,   y, 0.0, 0.0,
			0.0, 0.0,   z, 0.0
		];
	}
	$m43.scale = m4scale;

	/// Returns a yaw rotation matrix
	/// argument a the ammount of radians to yaw
	/// returns a rotation matrix
	function m4yaw(a) {
		var c=Math.cos(a);
		var s=Math.sin(a);
		return [
				c,  -s, 0.0, 0.0,
				s,   c, 0.0, 0.0,
			0.0, 0.0, 1.0, 0.0
		];
	}
	$m43.yaw = m4yaw;

	/// Returns a pitch rotation matrix
	/// argument a the ammount of radians to pitch
	/// returns a rotation matrix
	function m4pitch(a) {
		var c=Math.cos(a);
		var s=Math.sin(a);
		return [
				c, 0.0,   s, 0.0,
			0.0, 1.0, 0.0, 0.0,
			 -s, 0.0,   c, 0.0
		];
	}
	$m43.pitch = m4pitch;

	/// Returns a roll rotation matrix
	/// argument a the ammount of radians to roll
	/// returns a rotation matrix
	function m4roll(a) {
		var c=Math.cos(a);
		var s=Math.sin(a);
		return [
			1.0, 0.0, 0.0, 0.0,
			0.0,   c,  -s, 0.0,
			0.0,   s,   c, 0.0
		];
	}
	$m43.roll = m4roll;

	/// Returns a rotation matrix around the axis (x,y,z)
	/// argument a the angle to rotate in radians
	/// argument x the rotation axis x component
	/// argument y the rotation axis y component
	/// argument z the rotation axis z component
	/// returns the rotation matrix
	function m4rot(a, x, y, z) {
		var axisv = Math.sqrt(x * x + y * y + z * z); // normalize the rotation axis
		if (axisv < 0.00000001) return m4one();
		x = x / axisv;
		y = y / axisv;
		z = z / axisv;

		var c = Math.cos(a);
		var s = Math.sin(a);
		var xx = x * x;
		var yy = y * y;
		var zz = z * z;
		var xy = x * y;
		var xz = x * z;
		var yz = y * z;
		return [
			xx + c   - c*xx, xy + c*xy - s*z, xz + c*xz + s*y, 0.0,
			xy + c*xy + s*z, yy + c   - c*yy, yz + c*yz - s*x, 0.0,
			xz + c*xz - s*y, yz + c*yz - s*y, zz + c   - c*zz, 0.0
		];
	}
	$m43.rot = m4rot;

	/// Returns a string with the matrix values.
	/// argument A the matrix to display.
	/// argument sp the separator string.
	/// argument nl the new line string.
	/// returns a string with the matrix values.
	function m4str(A, sp, nl) {
		if (sp === undefined) sp = ", ";
		if (nl === undefined) nl = "\n"; // "<br />";
		return m4round(A[0]) + sp + m4round(A[1]) + sp + m4round(A[2]) + sp + m4round(A[3]) + sp + nl +
			m4round(A[4]) + sp + m4round(A[5]) + sp + m4round(A[6]) + sp + m4round(A[7]) + sp + nl +
			m4round(A[8]) + sp + m4round(A[9]) + sp + m4round(A[10])+ sp + m4round(A[11])+ sp + nl +
			"0" + sp + "0" + sp + "0" + sp + "1";
	}
	$m43.str = m4str;

	/// Applies the transformation matrix to a HTML5 canvas context
	/// argument context the context of the canvas
	/// argument a the matrix to apply
	function m4canvas(context, A) {
		return context.setTransform(A[0], A[4], A[1], A[5], A[3], A[7]);
	}
	$m43.canvas = m4canvas;

	/// @private
	/// Decompose the matrix into pixi transformation values and sets them over a pixi object.
	/// Pixi source code references: Matrix.prototype.setTransform and Matrix.prototype.decompose
	/// argument pixiobj the pixiobj where to apply the transform values.
	/// argument ... same arguments as canvas setTransform.
	function m4pixiDecompose(pixiobj, a, b, c, d, tx, ty) {
		var skewX = -Math.atan2(-c, d);
		var skewY = Math.atan2(b, a);
		var delta = Math.abs(skewX + skewY);
		if (delta < 0.00000001) {
			pixiobj.rotation = skewY;
			if ((a < 0.0) && (d >= 0.0)) {
				pixiobj.rotation += pixiobj.rotation <= 0.0 ? Math.PI : -Math.PI;
			}
			pixiobj.skew.x = pixiobj.skew.y = 0.0;
		} else {
			pixiobj.rotation = 0.0; // pixi didn't included this, but it is a bug
			pixiobj.skew.x = skewX;
			pixiobj.skew.y = skewY;
		}
		pixiobj.scale.x = Math.sqrt(a * a + b * b);
		pixiobj.scale.y = Math.sqrt(c * c + d * d);
		pixiobj.position.x = tx;
		pixiobj.position.y = ty;
	}
	$m43.pixiDecompose = m4pixiDecompose;

	function m4round(x) {
		var decimals = 2;
		var r = Math.pow(10.0, decimals);
		return Math.round(x * r) / r;
	}
	$m43.round = m4round;

	/// @private
	/// Converts to a string the results of running m4pixiDecompose
	/// Pixi source code references: Matrix.prototype.setTransform and Matrix.prototype.decompose
	/// argument pixiobj the pixiobj where to apply the transform values.
	/// argument ... same arguments as canvas setTransform.
	function m4pixistr(A, sp, nl) {
		if (sp === undefined) sp = ", ";
		if (nl === undefined) nl = "\n"; // "<br />";
		var pixiobj = {rotation: 0.0, position: {x: 0.0, y: 0.0}, skew: {x: 0.0, y: 0.0}, scale: {x: 0.0, y: 0.0}}
		m4pixiDecompose(pixiobj, A[0], A[4], A[1], A[5], A[3], A[7]);
		//return JSON.stringify(pixiobj);
		return "scale.x=" + m4round(pixiobj.scale.x) + sp + "scale.y=" + m4round(pixiobj.scale.y) + nl + "skew.x=" + m4round(pixiobj.scale.x) + sp + "skew.y=" + m4round(pixiobj.scale.y) + nl + "rotation=" + m4round(pixiobj.rotation);
	}
	$m43.chain = m4pixistr;

	/// Applies a matrix transform over a pixi object.
	/// argument pixiobj the pixiobj where to apply the transform.
	/// argument A the transformation matrix to apply.
	function m4pixi(pixiobj, A) {
		m4pixiDecompose(pixiobj, A[0], A[4], A[1], A[5], A[3], A[7]);
	}
	$m43.pixi = m4pixi;

	/// Applies a matrix transform over a pixi object and stores a the depth in the z property.
	/// argument pixiobj the pixiobj where to apply the transform.
	/// argument A the transformation matrix to apply.
	function m4pixiz(pixiobj, A) {
		m4pixiDecompose(pixiobj, A[0], A[4], A[1], A[5], A[3], A[7]);
		pixiobj.z = A[11];
	}
	$m43.pixiz = m4pixiz;

	/// @private
	/// The sorter function for elements a, b
	function m4sortzfn(a, b) {
		return a.z - b.z;
	}
	$m43.sortzWithSorter = m4chain;

	/// Sorts the elements in the pixiobj container using the z property set previously with m4pixiz(...)
	/// argument pixiobj the container whose children will be sorted, all the children must have the z property set, otherwise will fail.
	function m4sortz(pixiobj) {
		pixiobj.children.sort(m4sortzfn);
	}
	$m43.sortz = m4chain;

})();