import { psaGuardColors } from "@/data/catalog";

export type CatalogFilters = {
  types: string[];
  protects: string[];
  availability: "all" | "in_stock";
  price: "all" | "under-10" | "10-13" | "14-plus";
  color: string;
  interactiveOnly: boolean;
};

export const emptyCatalogFilters: CatalogFilters = {
  types: [],
  protects: [],
  availability: "all",
  price: "all",
  color: "",
  interactiveOnly: false
};

const typeOptions = [
  ["acrylic-cases", "Acrylic cases"],
  ["slab-protection", "Slab protection"],
  ["toploader-binders", "Binders"]
] as const;

const protectOptions = [
  ["etb", "Elite Trainer Box"],
  ["booster-box", "Booster box"],
  ["booster-bundle", "Booster bundle"],
  ["graded-slab", "Graded slab"],
  ["toploaded-cards", "Toploaded cards"]
] as const;

type CatalogFilterContentProps = {
  filters: CatalogFilters;
  onChange: (filters: CatalogFilters) => void;
  optionCounts: Record<string, number>;
  productCount: number;
  onClear: () => void;
};

export function CatalogFilterContent({
  filters,
  onChange,
  optionCounts,
  productCount,
  onClear
}: CatalogFilterContentProps) {
  function toggleArray(key: "types" | "protects", value: string) {
    const current = filters[key];
    onChange({
      ...filters,
      [key]: current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    });
  }

  return (
    <div className="catalog-filter-content">
      <div className="filter-heading-row">
        <strong>Filter products</strong>
        <button type="button" onClick={onClear}>Clear all</button>
      </div>
      <fieldset>
        <legend>Product type</legend>
        {typeOptions.map(([value, label]) => (
          <label key={value} className={optionCounts[value] === 0 ? "is-disabled" : undefined}>
            <input
              type="checkbox"
              checked={filters.types.includes(value)}
              disabled={optionCounts[value] === 0}
              onChange={() => toggleArray("types", value)}
            />
            <span>{label}</span><small>{optionCounts[value] ?? 0}</small>
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>What it protects</legend>
        {protectOptions.map(([value, label]) => (
          <label key={value} className={optionCounts[value] === 0 ? "is-disabled" : undefined}>
            <input
              type="checkbox"
              checked={filters.protects.includes(value)}
              disabled={optionCounts[value] === 0}
              onChange={() => toggleArray("protects", value)}
            />
            <span>{label}</span><small>{optionCounts[value] ?? 0}</small>
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Availability</legend>
        <label>
          <input
            type="checkbox"
            checked={filters.availability === "in_stock"}
            onChange={(event) => onChange({ ...filters, availability: event.target.checked ? "in_stock" : "all" })}
          />
          <span>In stock</span><small>{optionCounts.in_stock ?? 0}</small>
        </label>
      </fieldset>
      <div className="filter-select-group">
        <label htmlFor="catalog-price">Price</label>
        <select id="catalog-price" value={filters.price} onChange={(event) => onChange({ ...filters, price: event.target.value as CatalogFilters["price"] })}>
          <option value="all">All prices</option>
          <option value="under-10">Under $10</option>
          <option value="10-13">$10–$13</option>
          <option value="14-plus">$14 and up</option>
        </select>
      </div>
      <div className="filter-select-group">
        <label htmlFor="catalog-color">Guard color</label>
        <select
          id="catalog-color"
          value={filters.color}
          disabled={(optionCounts["slab-protection"] ?? 0) === 0}
          onChange={(event) => onChange({ ...filters, color: event.target.value })}
        >
          <option value="">Any color</option>
          {psaGuardColors.map((color) => <option value={color.slug} key={color.slug}>{color.name}</option>)}
        </select>
      </div>
      <fieldset>
        <legend>Product media</legend>
        <label className={optionCounts.interactive === 0 ? "is-disabled" : undefined}>
          <input
            type="checkbox"
            checked={filters.interactiveOnly}
            disabled={optionCounts.interactive === 0}
            onChange={(event) => onChange({ ...filters, interactiveOnly: event.target.checked })}
          />
          <span>Video preview</span><small>{optionCounts.interactive ?? 0}</small>
        </label>
      </fieldset>
      <p className="filter-live-count" aria-live="polite">{productCount} product{productCount === 1 ? "" : "s"} match</p>
    </div>
  );
}
