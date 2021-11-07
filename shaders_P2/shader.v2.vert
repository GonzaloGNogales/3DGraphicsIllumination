#version 330 core

in vec3 inPos;	
in vec3 inColor;
in vec3 inNormal;
in vec2 inTexCoord;	

uniform mat4 model;
uniform mat4 modelViewProj;
uniform mat4 modelView;
uniform mat4 normal;

out vec3 color;
out vec3 vpos;
out vec3 vposw;
out vec3 vnormal;
out vec2 vtexcoord;

void main()
{
	color = inColor;
	vpos = (modelView * vec4(inPos, 1.0)).xyz;
	vposw = (model * vec4(inPos, 1.0)).xyz;
	vnormal = (normal * vec4(inNormal, 0.0)).xyz;
	vtexcoord = inTexCoord;
	gl_Position =  modelViewProj * vec4(inPos,1.0);
}
