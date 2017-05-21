/******************************************************************************

Visualization plotting random coordinates in a square to estimate Pi.

Percentage of those failing inside the circle (where x^2 + y^2 < 1) shown in 
green can be divided by 4 to estimate Pi.

Build with https://kripken.github.io/emscripten-site/index.html

emcc pi.cpp -O3 -s WASM=1 -o pi.html -s EXPORTED_FUNCTIONS="['_pi']" --shell-file template.html

******************************************************************************/

#include <stdio.h>
#include <stdlib.h>
#include <SDL/SDL.h>
#include <time.h>
#include <math.h>
#include <emscripten.h>
using namespace std;

#ifdef __cplusplus
extern "C" {
#endif

double pi(double iter)
{
  SDL_Init(SDL_INIT_VIDEO);
  SDL_Surface *screen = SDL_SetVideoMode(200, 200, 32, SDL_SWSURFACE);
  SDL_Rect rect = {0, 0, 200, 200};
  SDL_FillRect(screen, &rect, SDL_MapRGBA(screen->format, 255, 255, 255, 255));
  if (SDL_MUSTLOCK(screen))
    SDL_LockSurface(screen);

  double x, y;
  int col, p, hits = 0;
  srand(time(0));

  for (int i = 0; i < iter; i++)
  {
    x = (double(rand()) / double(RAND_MAX));
    y = (double(rand()) / double(RAND_MAX));
    if ((x * x) + (y * y) < 1)
    {
      hits++;
      col = SDL_MapRGB(screen->format, 144, 238, 144);
    }
    else
    {
      col = SDL_MapRGB(screen->format, 205, 92, 92);
    }

    p = floor(y * 200) * 200 + x * 200;
    *((Uint32 *)screen->pixels + p) = col;
  }
  if (SDL_MUSTLOCK(screen))
    SDL_UnlockSurface(screen);
  SDL_Flip(screen);

  SDL_Quit();

  return 4 * hits / iter;
}

#ifdef __cplusplus
}
#endif