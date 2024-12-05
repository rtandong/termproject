$(document).ready(function () {
    const API_KEY = '396991ad33eeee38676b0e26e655c333'; // Your TMDb API key
    const MAX_RESULTS_PER_PAGE = 10;
    let movies = [];
    let currentPage = 1;
    let totalPages = 0;
    let isGridView = true;

    // Search Movies from TMDb API
    function searchMovies(query, page = 1) {
        const startIndex = (page - 1) * MAX_RESULTS_PER_PAGE;
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

    // Display Search Results
    function displayResults(movies) {
        const container = $('#results');
        container.empty().addClass(isGridView ? 'grid-view' : 'list-view');
        if (movies.length === 0) {
            container.html('<p>No results found.</p>');
            return;
        }
        movies.forEach(movie => {
            const title = movie.title || 'No Title Available';
            const imageUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'placeholder.jpg';
            container.append(`
                <div class="movie" data-id="${movie.id}">
                    <img src="${imageUrl}" alt="${title}">
                    <p>${title}</p>
                </div>
            `);
        });
    }

    // Setup Pagination
    function setupPagination(totalPages, currentPage) {
        $('#pagination').empty();
        for (let i = 1; i <= Math.min(totalPages, 5); i++) {
            $('#pagination').append(`
                <button class="page-link" data-page="${i}">${i}</button>
            `);
            }
        }
    }
