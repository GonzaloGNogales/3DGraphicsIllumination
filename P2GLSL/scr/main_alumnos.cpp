#include "BOX.h"
#include <IGL/IGlib.h>

#define GLM_FORCE_RADIANS
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <iostream>

const float ORBIT_RADIUS = 10.0f;

//Idenficadores de los objetos de la escena
int objId =-1;

//Declaración de CB
void resizeFunc(int width, int height);
void idleFunc();
void keyboardFunc(unsigned char key, int x, int y);
void mouseFunc(int button, int state, int x, int y);
void mouseMotionFunc(int x, int y);

//Variables de la cámara
float cameraX = 0.0f, cameraZ = -6.0f, cameraAlphaY = 0.0f, cameraAlphaX = 0.0f;
glm::vec3 lookAt = glm::vec3(0.0f, 0.0f, 0.0f);
glm::vec3 right = glm::vec3(-10.0f, 0.0f, -10.0f);

int main(int argc, char** argv)
{
	std::locale::global(std::locale("spanish"));// acentos ;)
	if (!IGlib::init("../shaders_P2/shader.v2.vert", "../shaders_P2/shader.v2.frag"))
		return -1;
  //Se ajusta la cámara
	//Si no se da valor se cojen valores por defecto
	glm::mat4 view = glm::mat4(1.0);
	view[3].z = -6;

	glm::mat4 proj = glm::mat4(1.0);
	float f = 1.0f / tan(3.141592f / 6.0f);
	float far = 10.0f;
	float near = 0.1f;

	proj[0].x = f;
	proj[1].y = f;
	proj[2].z = (far + near) / (near - far);
	proj[2].w = -1.0f;
	proj[3].z = (2.0f * far * near) / (near - far);
	proj[3].w = 0.0f;
	IGlib::setProjMat(proj);
	IGlib::setViewMat(view);

	//Creamos el objeto que vamos a visualizar
	objId = IGlib::createObj(cubeNTriangleIndex, cubeNVertex, cubeTriangleIndex, 
			cubeVertexPos, cubeVertexColor, cubeVertexNormal,cubeVertexTexCoord, cubeVertexTangent);
	IGlib::addColorTex(objId, "../img/color.png");
		
	glm::mat4 modelMat = glm::mat4(1.0f);
	IGlib::setModelMat(objId, modelMat);
	
	//CBs
	IGlib::setIdleCB(idleFunc);
	IGlib::setResizeCB(resizeFunc);
	IGlib::setKeyboardCB(keyboardFunc);
	IGlib::setMouseCB(mouseFunc);
	IGlib::setMouseMoveCB(mouseMotionFunc);
	
	//Mainloop
	IGlib::mainLoop();
	IGlib::destroy();
	return 0;
}

void resizeFunc(int width, int height)
{
	//Ajusta el aspect ratio al tamaño de la venta
	float a = float(width) / float(height);

	float n = 1.0f;
	float f = 60.0f;
	float x = 1.0f / (glm::tan(30.0f * 3.1419f / 180.0f));
	glm::mat4 proj = glm::mat4(0.0f);
	proj[0].x = x * 1.0 / a;
	proj[1].y = x;
	proj[2].z = (f + n) / (n - f);
	proj[2].w = -1.0f;
	proj[3].z = 2.0f * n * f / (n - f);

	IGlib::setProjMat(proj);
}

void idleFunc()
{
	glm::mat4 modelMat(1.0f);
	static float angle = 0.0f;
	angle = (angle > 3.141592f * 2.0f) ? 0 : angle + 0.01f;
	
	//modelMat = glm::rotate(modelMat, angle, glm::vec3(1.0f, 1.0f, 0.0f));

	//IGlib::setModelMat(objId, modelMat);
	IGlib::addColorTex(objId, "../img/color.png");
	IGlib::addSpecularTex(objId, "../img/specMap.png");
	IGlib::addEmissiveTex(objId, "../img/emissive.png");
}

void keyboardFunc(unsigned char key, int x, int y)
{
	std::cout << "Se ha pulsado la tecla " << key << std::endl << std::endl;
	const float SPEED = 1.0f;
	const float ALPHA = 5.0f;
	switch (key) {
	case 'w':  //Alante
		cameraX += SPEED * glm::sin(glm::radians(-cameraAlphaY));
		cameraZ += SPEED * glm::cos(glm::radians(-cameraAlphaY));
		break;
	case 'W':
		cameraX += SPEED * glm::sin(glm::radians(-cameraAlphaY));
		cameraZ += SPEED * glm::cos(glm::radians(-cameraAlphaY));
		break;
	case 's':  //Atrás
		cameraX -= SPEED * glm::sin(glm::radians(-cameraAlphaY));
		cameraZ -= SPEED * glm::cos(glm::radians(-cameraAlphaY));
		break;
	case 'S':
		cameraX -= SPEED * glm::sin(glm::radians(-cameraAlphaY));
		cameraZ -= SPEED * glm::cos(glm::radians(-cameraAlphaY));
		break;
	case 'a':  //Izq
		cameraX += SPEED * glm::cos(glm::radians(cameraAlphaY));
		cameraZ += SPEED * glm::sin(glm::radians(cameraAlphaY));
		break;
	case 'A':
		cameraX += SPEED * glm::cos(glm::radians(cameraAlphaY));
		cameraZ += SPEED * glm::sin(glm::radians(cameraAlphaY));
		break;
	case 'd':  //Der
		cameraX -= SPEED * glm::cos(glm::radians(cameraAlphaY));
		cameraZ -= SPEED * glm::sin(glm::radians(cameraAlphaY));
		break;
	case 'D':
		cameraX -= SPEED * glm::cos(glm::radians(cameraAlphaY));
		cameraZ -= SPEED * glm::sin(glm::radians(cameraAlphaY));
		break;
	case 'q':  //RotIzq
		cameraAlphaY -= ALPHA;
		break;
	case 'Q':
		cameraAlphaY -= ALPHA;
		break;
	case 'e':  //RotDer
		cameraAlphaY += ALPHA;
		break;
	case 'E':
		cameraAlphaY += ALPHA;
		break;
	}
	glm::mat4 camera_movement = glm::mat4(1.0f);
	//Inicializar estado actual de cámara (traslación)
	camera_movement[3].x = cameraX;
	camera_movement[3].z = cameraZ;
	//Rotación
	glm::mat4 center_camera = glm::translate(camera_movement, glm::vec3(-cameraX, 0.0f, -cameraZ));  // Matriz para trasladar al centro
	glm::mat4 rotate_camera = glm::rotate(center_camera, glm::radians(cameraAlphaY), glm::vec3(0.0f, 1.0f, 0.0f));
	glm::mat4 final_camera_state = glm::translate(rotate_camera, glm::vec3(cameraX, 0.0f, cameraZ));
	IGlib::setViewMat(final_camera_state);

	lookAt.x = cameraX;
	lookAt.z = cameraZ;
	right.x = cameraX;
	right.z = cameraZ;
	lookAt = glm::vec3(lookAt.x + ORBIT_RADIUS * glm::sin(glm::radians(-cameraAlphaY)), 0.0f, lookAt.z + ORBIT_RADIUS * glm::cos(glm::radians(cameraAlphaY)));
	right = glm::vec3(right.x + ORBIT_RADIUS * -glm::cos(glm::radians(-cameraAlphaY)), 0.0f, right.z + ORBIT_RADIUS * -glm::cos(glm::radians(cameraAlphaY)));
	std::cout << "Lookat x: " << lookAt.x << " - lookAt z: " << lookAt.z << std::endl;
	std::cout << "Right x: " << right.x << " - Right z: " << right.z << std::endl;
}

void mouseFunc(int button, int state, int x, int y)
{
	if (state==0)
		std::cout << "Se ha pulsado el botón ";
	else
		std::cout << "Se ha soltado el botón ";
	
	if (button == 0) std::cout << "de la izquierda del ratón " << std::endl;
	if (button == 1) std::cout << "central del ratón " << std::endl;
	if (button == 2) std::cout << "de la derecha del ratón " << std::endl;

	std::cout << "en la posición " << x << " " << y << std::endl << std::endl;
}

void mouseMotionFunc(int x, int y)
{
	glm::mat4 camera_orbit = glm::mat4(1.0f);
	//Inicializar estado actual de cámara (traslación)
	camera_orbit[3].z = -6;

	float movX = 0.0f - lookAt.x;
	float movZ = 0.0f - lookAt.z;
	//Calcular angle con respecto al cambio en la x del mouse click en el viewport
	float angleX = x;

	glm::mat4 translate_to_rot_center = glm::translate(camera_orbit, glm::vec3(movX, 0.0f, movZ));
	glm::mat4 rotation_from_rot_centerX = glm::rotate(translate_to_rot_center, glm::radians(angleX), glm::vec3(0.0f, 1.0f, 0.0f));
	glm::mat4 final_view = glm::translate(rotation_from_rot_centerX, glm::vec3(-movX, 0.0f, -movZ));
	IGlib::setViewMat(final_view);
}
