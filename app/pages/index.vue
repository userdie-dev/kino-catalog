<script setup lang="ts">
const { data: popularMovies, status: popularStatus, error: popularError, refresh: refreshPopular }
  = await useAsyncData('home-popular-movies', () => fetchPopularMovies(1))

const { data: topRatedMovies, status: topRatedStatus, error: topRatedError, refresh: refreshTopRated }
  = await useAsyncData('home-top-rated-movies', () => fetchTopRatedMovies(1))

const { data: nowPlayingMovies, status: nowPlayingStatus, error: nowPlayingError, refresh: refreshNowPlaying }
  = await useAsyncData('home-now-playing-movies', () => fetchNowPlayingMovies(1))

const { data: upcomingMovies, status: upcomingStatus, error: upcomingError, refresh: refreshUpcoming }
  = await useAsyncData('home-upcoming-movies', () => fetchUpcomingMovies(1))

const { data: popularTVShows, status: popularTVStatus, error: popularTVError, refresh: refreshPopularTV }
  = await useAsyncData('home-popular-tv', () => fetchPopularTVShows(1))

const { data: popularActors, status: popularActorsStatus, error: popularActorsError, refresh: refreshPopularActors }
  = await useAsyncData('home-popular-actors', () => fetchPopularActors(1))
</script>

<template>
  <div>
    <section class="relative isolate overflow-hidden border-b border-default">
      <div class="absolute inset-0 -z-10 bg-elevated">
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,color-mix(in_oklab,var(--ui-primary)_16%,transparent),transparent)]" />
      </div>

      <UPageHero
        title="Каталог фильмов и актёров"
        description="Популярные и высокорейтинговые фильмы, а также популярные актёры — данные из TMDB API."
        :ui="{ container: 'py-16 sm:py-20 lg:py-24' }"
      />
    </section>

    <nav class="sticky top-(--ui-header-height) z-40 border-b border-default bg-default/80 backdrop-blur">
      <UContainer class="flex gap-6 overflow-x-auto py-3 text-sm scrollbar-none">
        <a
          href="#popular"
          class="shrink-0 font-medium text-muted hover:text-primary"
        >Популярные фильмы</a>
        <a
          href="#top-rated"
          class="shrink-0 font-medium text-muted hover:text-primary"
        >Топ рейтинга</a>
        <a
          href="#now-playing"
          class="shrink-0 font-medium text-muted hover:text-primary"
        >Смотрят сейчас</a>
        <a
          href="#upcoming"
          class="shrink-0 font-medium text-muted hover:text-primary"
        >Ожидаемые</a>
        <a
          href="#tv"
          class="shrink-0 font-medium text-muted hover:text-primary"
        >Сериалы</a>
        <a
          href="#actors"
          class="shrink-0 font-medium text-muted hover:text-primary"
        >Актёры</a>
      </UContainer>
    </nav>

    <PreviewSection
      id="popular"
      title="Популярные фильмы"
      to="/movies?mode=popular"
      :status="popularStatus"
      :error="popularError"
      class="scroll-mt-32"
      @retry="refreshPopular()"
    >
      <div
        v-for="movie in popularMovies?.results.slice(0, 10)"
        :key="movie.id"
        class="w-40 sm:w-48 shrink-0"
      >
        <MovieCard :movie="movie" />
      </div>
    </PreviewSection>

    <PreviewSection
      id="top-rated"
      title="Фильмы с высоким рейтингом"
      to="/movies?mode=top_rated"
      :status="topRatedStatus"
      :error="topRatedError"
      class="scroll-mt-32"
      @retry="refreshTopRated()"
    >
      <div
        v-for="movie in topRatedMovies?.results.slice(0, 10)"
        :key="movie.id"
        class="w-40 sm:w-48 shrink-0"
      >
        <MovieCard :movie="movie" />
      </div>
    </PreviewSection>

    <PreviewSection
      id="now-playing"
      title="Смотрят сейчас"
      to="/movies?mode=now_playing"
      :status="nowPlayingStatus"
      :error="nowPlayingError"
      class="scroll-mt-32"
      @retry="refreshNowPlaying()"
    >
      <div
        v-for="movie in nowPlayingMovies?.results.slice(0, 10)"
        :key="movie.id"
        class="w-40 sm:w-48 shrink-0"
      >
        <MovieCard :movie="movie" />
      </div>
    </PreviewSection>

    <PreviewSection
      id="upcoming"
      title="Ожидаемые"
      to="/movies?mode=upcoming"
      :status="upcomingStatus"
      :error="upcomingError"
      class="scroll-mt-32"
      @retry="refreshUpcoming()"
    >
      <div
        v-for="movie in upcomingMovies?.results.slice(0, 10)"
        :key="movie.id"
        class="w-40 sm:w-48 shrink-0"
      >
        <MovieCard :movie="movie" />
      </div>
    </PreviewSection>

    <PreviewSection
      id="tv"
      title="Популярные сериалы"
      to="/tv"
      :status="popularTVStatus"
      :error="popularTVError"
      class="scroll-mt-32"
      @retry="refreshPopularTV()"
    >
      <div
        v-for="show in popularTVShows?.results.slice(0, 10)"
        :key="show.id"
        class="w-40 sm:w-48 shrink-0"
      >
        <TVCard :show="show" />
      </div>
    </PreviewSection>

    <PreviewSection
      id="actors"
      title="Популярные актёры"
      to="/actors?mode=popular"
      :status="popularActorsStatus"
      :error="popularActorsError"
      class="scroll-mt-32"
      @retry="refreshPopularActors()"
    >
      <div
        v-for="actor in popularActors?.results.slice(0, 10)"
        :key="actor.id"
        class="w-32 sm:w-40 shrink-0"
      >
        <ActorCard :actor="actor" />
      </div>
    </PreviewSection>
  </div>
</template>
