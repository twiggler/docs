/* global instantsearch */
((function($) {
    function getTemplate(templateName) {
      return document.getElementById(templateName + '-template').innerHTML;
    }

    var search = instantsearch(ALGOLIA_CONFIG);

    /*
      SEARCHBOX
    */
    var DEBOUNCE = null;
    search.addWidget(
      instantsearch.widgets.searchBox({
        container: '#mendix_search',
        autofocus: true,
        wrapInput: false,
        queryHook: function (query, search) {
          if (DEBOUNCE) {
            clearTimeout(DEBOUNCE);
          }
          DEBOUNCE = setTimeout(function () {
            search(query);
          }, 200);
        }
      })
    );

    /*
      STATS
    */
    search.addWidget(
      instantsearch.widgets.stats({
        container: '.search-header',
        templates: {
          body: getTemplate('stats')
        },
        transformData: function(result) {
          result.emptyQuery = result.query === "";
          result.nonEmptyQuery = !result.emptyQuery;
          $('.search .form-control-clear').toggleClass('hidden', result.emptyQuery);
          return result;
        }
      })
    );

    /*
      FILTER (SPACES)
    */
    search.addWidget(
      instantsearch.widgets.refinementList({
        container: '#space',
        attributeName: 'space',
        operator: 'or',
        //sortBy: ['isRefined', 'count:desc', 'name:asc'],
        sortBy: ['count:desc', 'name:asc'],
        limit: 50,
        templates: {
          header: '<h5 class="search_filters_block_title">Main categories</h5>'
        }
      })
    );

    /*
      RESULTS
    */
    search.addWidget(
      instantsearch.widgets.hits({
        container: '#hits',
        hitsPerPage: 10,
        templates: {
          empty: getTemplate('no-results'),
          item: getTemplate('hit')
        },
        transformData : function(hit) {
          if (hit && hit.url) {
            $('.search-main').toggleClass('col-md-12', false);
            $('.search-main').toggleClass('no-results', false);
            $('.search-main').toggleClass('col-md-9', true);
            $('.search-sidebar').toggleClass('hidden', false);
            hit.url = hit.url.replace('.html', '');
          } else {
            $('.search-main').toggleClass('col-md-12', true);
            $('.search-main').toggleClass('no-results', true);
            $('.search-main').toggleClass('col-md-9', false);
            $('.search-sidebar').toggleClass('hidden', true);
          }
          return hit;
        }
      })
    );

    /*
      PAGINATION
    */
    search.addWidget(
      instantsearch.widgets.pagination({
        container: '#pagination',
        cssClasses: {
          root: 'pagination',
          active: 'active'
        }
      })
    );


    search.start();
})(jQuery));
