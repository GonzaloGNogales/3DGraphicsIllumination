#version 330 core

in vec3 inPos;	
in vec3 inColor;
in vec3 inNormal;
in vec2 inTexCoord;	
in vec3 inTangent;	//Accedemos a las tangentes del modelo


uniform mat4 model;
uniform mat4 modelViewProj;
uniform mat4 modelView;
uniform mat4 normal;
uniform mat4 view;


//uniform sampler2D normalTex; //Normal de la textura


out vec3 color;
out vec3 vpos;
out vec3 vnormal;
out vec2 vtexcoord;

out mat4 vTBN;


void main()
{
	color = inColor;
	vpos = (modelView * vec4(inPos, 1.0)).xyz;	//--> l estará en coord de la camara
	vnormal = (normal * vec4(inNormal, 0.0)).xyz; //El vector normal esta en coord de la camara
	vtexcoord = inTexCoord;

//	//Calculamos la bitangente = producto vectorial de n y tan
//	vec3 bitangent = vec3(	inNormal.y * inTangent.z - inTangent.y * inNormal.z,
//							inNormal.z * inTangent.x - inTangent.z * inNormal.x,
//							inNormal.x * inTangent.y - inTangent.x * inNormal.y);
//
//	//Creamos la matriz TBN y se la mandamos al shader de fragmentos
//	vTBN = mat4( inTangent.x, bitangent.x, inNormal.x,  0.0,
//					 inTangent.y, bitangent.y, inNormal.y,  0.0,
//					 inTangent.z, bitangent.z, inNormal.z,  0.0,
//					  0.0,			0.0,		 0.0,	    1.0);

	gl_Position =  modelViewProj * vec4(inPos,1.0);
}
