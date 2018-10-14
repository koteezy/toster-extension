import $ from 'jquery';

const attrOrNull = ( el, attribute ) => {
    return el[ attribute ] ? el[ attribute ] : null;
};

const cacheName = name => {
    const date = new Date;

    return 'cache:' + name + date.getFullYear() + date.getMonth() + date.getDay();
};
/**
 * Берем данные из по этому пользователю(урлу)
 *
 * @param href
 * @return {string | null}
 */
const getCached = href => localStorage.getItem( cacheName( href ) );

const allUserMetas = href => {
    const username = href.split( '/' ).pop();

    return $( 'span.user-summary__nickname' ).has( 'meta[content=\'' + username + '\']' );
};

/**
 * Берем url текущего пользователя
 */
const userHref = attrOrNull( document.querySelector( 'a.user-panel__avatar' ), 'href' );

const users = [], allElements = $( 'a.user-summary__name' );

/**
 * Получаем инфу с только что полученной страницы
 * в виде обьекта.
 *
 * @param html
 * @return {Array}
 */
const info = html => {
    const result   = [],
          elements = $( html ).find( '.inline-list__item.inline-list__item_bordered' ).slice( 1 );

    elements.each( ( _, el ) => {
        result.push( {
            count: el.querySelector( '.mini-counter__count' ).textContent.trim(),
            name: el.querySelector( '.mini-counter__value' ).textContent.trim(),
        } );
    } );

    return result;
};

allElements.each( ( index, el ) => {
    if ( users.indexOf( el.href ) === -1 && el.href !== userHref )
        users.push( el.href );
} );

users.forEach( href => {
    const cached = getCached( href ),
          metas  = allUserMetas( href );

    if ( cached ) {

        metas.each( ( i, e ) => {
            e.textContent = cached;
        } );

        return;
    }

    $.ajax( href ).done( response => {
        const textContent = info( response ).map( item => item.name + ':' + item.count ).join( ', ' );

        metas.each( ( i, e ) => {
            e.textContent = textContent;
        } );

        localStorage.setItem( cacheName( href ), textContent );
    } );
} );