import PropTypes from 'prop-types';
export const ViewMap = ({basemap, onChange}) => {
    // определяем типы пропсов с помощью PropTypes
    ViewMap.propTypes = {
        basemap: PropTypes.string,
        onChange: PropTypes.func,
    };
    // объект с ключами
    const basemaps = {
        osm: 'OpenStreetMap',
        hot: 'Humanitarian',
        dark: 'Dark Mode',
        cycle: 'Cycle Map',
};

return (
    <div className="basemap-selector">
        {/* проходим по всем ключам basemaps и создаем кнопки */}
        {Object.keys(basemaps).map((key) => (
            <button
                key={key}
                onClick={() => onChange(key)} // при клике вызываем функцию onChange с ключом
                className={basemap === key ? 'active' : ''} // класс active для выбранного базового слоя
            >
                {/* отображаем имя карты */}
                {basemaps[key]}  
            </button>
        ))}
    </div>
);
};
