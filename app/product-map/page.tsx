"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { continents } from "@/content/products";
import type { Continent } from "@/content/products";
import "./product-map.css";

export default function ProductMapPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const selected = continents.find((continent) => continent.id === selectedId) ?? null;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const chooseContinent = (continent: Continent) => {
    setSelectedId(continent.id);
    setActiveProductIndex(0);
  };

  const activeProduct = selected?.products[activeProductIndex];
  const stageStyle = selected
    ? { transform: `translate(${selected.focus.x}%, ${selected.focus.y}%) scale(${selected.focus.scale})` }
    : undefined;

  return (
    <main className={`product-map-page ${selected ? "has-selection" : ""}`}>
      <header className="map-header">
        <Link href="/#onboarding" className="map-back">← 返回任務看板</Link>
        <div><small>QA STORMING · WORLD ATLAS</small><h1>產品世界地圖</h1></div>
        <button className="reset-map" onClick={() => setSelectedId(null)} disabled={!selected}>顯示全圖</button>
      </header>

      <section className="map-explorer" aria-label="SWAG 產品世界地圖">
        <div className="map-viewport">
          <div className="map-stage" style={stageStyle}>
            <div className="map-sea" aria-hidden="true" />
            <div className="map-cloud cloud-a" aria-hidden="true">☁</div>
            <div className="map-cloud cloud-b" aria-hidden="true">☁</div>
            <div className="map-compass" aria-hidden="true"><span>N</span><i>✦</i></div>
            {continents.map((continent) => (
              <button
                key={continent.id}
                className={`continent continent-${continent.theme} ${selectedId === continent.id ? "is-selected" : ""}`}
                style={{ left: `${continent.position.x}%`, top: `${continent.position.y}%` }}
                onClick={() => chooseContinent(continent)}
                aria-pressed={selectedId === continent.id}
                aria-label={`探索${continent.name}`}
              >
                <span className="continent-label"><small>{continent.subtitle}</small><b>{continent.name}</b>{continent.status === "development" && <em>開發中</em>}</span>
              </button>
            ))}
          </div>
          {!selected && <p className="map-hint"><span>✦</span> 選擇一座大陸開始探索 <span>✦</span></p>}
        </div>

        <aside className={`product-scroll ${selected ? "is-open" : ""}`} aria-live="polite" aria-hidden={!selected}>
          {selected && activeProduct && (
            <>
              <button className="scroll-close" onClick={() => setSelectedId(null)} aria-label="關閉產品詳情">×</button>
              <p className="scroll-kicker">{selected.subtitle}</p>
              <h2>{selected.name}</h2>
              {selected.products.length > 1 && (
                <div className="product-tabs" role="tablist" aria-label={`${selected.name}產品`}>
                  {selected.products.map((product, index) => (
                    <button key={product.id} role="tab" aria-selected={activeProductIndex === index} onClick={() => setActiveProductIndex(index)}>{product.name}</button>
                  ))}
                </div>
              )}
              <div className="product-status"><span className={`status-dot status-${activeProduct.status ?? "active"}`} />{activeProduct.status === "development" ? "IN DEVELOPMENT" : activeProduct.status === "beta" ? "BETA" : "ACTIVE"}</div>
              <h3>{activeProduct.name}</h3>
              <dl className="product-facts">
                <div><dt>技術類型</dt><dd>{activeProduct.technology}</dd></div>
                {activeProduct.environment && <div><dt>使用環境</dt><dd>{activeProduct.environment}</dd></div>}
              </dl>
              <section><h4>核心說明</h4><p>{activeProduct.summary}</p></section>
              {activeProduct.sections?.map((section) => <section key={section.label}><h4>{section.label}</h4><p>{section.value}</p></section>)}
              <section className="qa-notes"><h4>QA 注意事項</h4><ul>{activeProduct.notes.map((note) => <li key={note}>{note}</li>)}</ul></section>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}
