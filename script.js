
$(document).ready(function () {
    const API_KEY = '396991ad33eeee38676b0e26e655c333'; // Your TMDb API key
    const MAX_RESULTS_PER_PAGE = 10;
    let movies = [];
    let currentPage = 1;
    let totalPages = 0;
    let isGridView = true;

    // Search Movies from TMDb API
    function searchMovies(query, page = 1) {
        $.getJSON(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`)
            .done(function (data) {
                movies = data.results || [];
                totalPages = data.total_pages;
                displayResults(movies);
                setupPagination(totalPages, page);
            })
            .fail(() => {
                $('#results').html('<p>An error occurred while fetching data. Please try again.</p>');
            });
    }

    // Discover Trending Movies/TV Shows
    function discoverTrending(page = 1) {
        $.getJSON(`https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}&page=${page}`)
            .done(function (data) {
                displayResults(data.results);
                setupPagination(data.total_pages, page);
            })
            .fail(() => {
                $('#results').html('<p>Error fetching data. Please try again.</p>');
            });
    }

    // Display Popular Movies/TV Shows
    function discoverPopular(page = 1) {
        $.getJSON(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${page}`)
            .done(function (data) {
                displayResults(data.results);
                setupPagination(data.total_pages, page);
            })
            .fail(() => {
                $('#results').html('<p>Error fetching data. Please try again.</p>');
            });
    }

    // Display Top Rated Movies/TV Shows
    function discoverTopRated(page = 1) {
        $.getJSON(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&page=${page}`)
            .done(function (data) {
                displayResults(data.results);
                setupPagination(data.total_pages, page);
            })
            .fail(() => {
                $('#results').html('<p>Error fetching data. Please try again.</p>');
            });
    }

    // Display Search Results
    function displayResults(movies) {
        const container = $('#results');
        container.empty().addClass(isGridView ? 'grid-view' : 'list-view');
        if (movies.length === 0) {
            container.html('<p>No results found.</p>');
            return;
        }
        movies.forEach(movie => {
            const title = movie.title || movie.name || 'No Title Available';
            const imageUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'placeholder.jpg';
            container.append(`
                <div class="movie" data-id="${movie.id}">
                    <img src="${imageUrl}" alt="${title}">
                    <p>${title}</p>
                </div>
            `);
        });
    }

    // Display Movie Details
    function displayMovieDetails(movieId) {
        $.getJSON(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`)
            .done(function (movie) {
                $('#results').addClass('hidden');
                const details = `
                    <h2>${movie.title}</h2>
                    <p>${movie.overview}</p>
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                    <h3>Release Date: ${movie.release_date}</h3>
                    <h3>Rating: ${movie.vote_average}</h3>
                    <p>Genres: ${movie.genres.map(genre => genre.name).join(', ')}</p>
                `;
                $('#movieDetails .details-content').html(details);
                $('#movieDetails').removeClass('hidden');
            })
            .fail(() => {
                $('#movieDetails').html('<p>Failed to load movie details.</p>');
            });
    }

    // Setup Pagination
    function setupPagination(totalPages, currentPage) {
        $('#pagination').empty();
        for (let i = 1; i <= totalPages; i++) {
            $('#pagination').append(`
                <button class="page-link" data-page="${i}">${i}</button>
            `);
        }
        $('.page-link').removeClass('active');
        $(`.page-link[data-page="${currentPage}"]`).addClass('active');
    }

    // Toggle between Grid and List View
    $('#viewToggle button').click(function () {
        $('#viewToggle button').removeClass('active');
        $(this).addClass('active');
        isGridView = $(this).attr('id') === 'gridView';
        $('#results').removeClass('grid-view list-view').addClass(isGridView ? 'grid-view' : 'list-view');
    });

    // Event Listeners
    $('#searchButton').click(() => {
        const query = $('#searchTerm').val().trim();
        if (query) searchMovies(query);
    });

    $('#trendingButton').click(() => {
        discoverTrending();
    });

    $('#popularButton').click(() => {
        discoverPopular();
    });

    $('#topRatedButton').click(() => {
        discoverTopRated();
    });

    $('#pagination').on('click', '.page-link', function () {
        const query = $('#searchTerm').val().trim();
        currentPage = $(this).data('page');
        if (query) {
            searchMovies(query, currentPage);
        } else {
            discoverTrending(currentPage);
        }
    });

    // Movie Click Event to Display Details
    $('#results').on('click', '.movie', function () {
        const movieId = $(this).data('id');
        displayMovieDetails(movieId);
    });

    // Back Button Event to Return to Search
    $('#backButton').click(() => {
        $('#movieDetails').addClass('hidden');
        $('#results').removeClass('hidden');
        $('#searchSection').removeClass('hidden');
    });
});

