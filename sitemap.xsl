<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="fr">
      <head>
        <title>Sitemap XML — Jobydoo Agency</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet" />
        <style type="text/css">
          :root {
            --primary: #1e6aff;
            --primary-dark: #0f4bd9;
            --primary-soft: rgba(30, 106, 255, 0.08);
            --text: #0b1e3f;
            --text-dim: #4a5d78;
            --text-light: #7c8ba1;
            --bg: #f8fafc;
            --card-bg: #ffffff;
            --border: #e2e8f0;
            --border-subtle: #f1f5f9;
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: var(--bg);
            color: var(--text);
            line-height: 1.5;
            padding: 32px 20px;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 1060px;
            margin: 0 auto;
          }
          .header {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 28px 32px;
            margin-bottom: 24px;
            box-shadow: 0 4px 20px -2px rgba(11, 30, 63, 0.05);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 20px;
          }
          .brand-col {
            display: flex;
            align-items: center;
            gap: 14px;
          }
          .logo {
            width: 44px;
            height: 44px;
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            color: #fff;
            font-weight: 800;
            font-size: 1.35rem;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 6px 16px rgba(30, 106, 255, 0.3);
          }
          h1 {
            font-size: 1.35rem;
            font-weight: 800;
            letter-spacing: -0.02em;
            color: var(--text);
            display: flex;
            align-items: center;
            gap: 8px;
          }
          h1 span {
            color: var(--primary);
          }
          .desc {
            font-size: 0.88rem;
            color: var(--text-dim);
            margin-top: 2px;
          }
          .badge-counter {
            background: var(--primary-soft);
            color: var(--primary);
            border: 1px solid rgba(30, 106, 255, 0.2);
            padding: 8px 16px;
            border-radius: 999px;
            font-weight: 700;
            font-size: 0.85rem;
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }
          .table-wrapper {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px -2px rgba(11, 30, 63, 0.05);
          }
          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            font-size: 0.88rem;
          }
          thead th {
            background: #f1f5f9;
            color: var(--text-dim);
            padding: 14px 20px;
            font-weight: 700;
            font-size: 0.78rem;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            border-bottom: 1px solid var(--border);
          }
          tbody tr {
            border-bottom: 1px solid var(--border-subtle);
            transition: background-color 0.15s ease;
          }
          tbody tr:last-child {
            border-bottom: none;
          }
          tbody tr:hover {
            background-color: rgba(30, 106, 255, 0.025);
          }
          td {
            padding: 14px 20px;
            vertical-align: middle;
          }
          td.url-cell {
            font-weight: 600;
          }
          td.url-cell a {
            color: var(--primary);
            text-decoration: none;
            word-break: break-all;
            transition: color 0.15s ease;
          }
          td.url-cell a:hover {
            color: var(--primary-dark);
            text-decoration: underline;
          }
          .pill-priority {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 6px;
            font-weight: 700;
            font-size: 0.78rem;
            background: #e0f2fe;
            color: #0369a1;
          }
          .pill-priority.high {
            background: #dcfce7;
            color: #15803d;
          }
          .pill-freq {
            display: inline-block;
            font-size: 0.82rem;
            color: var(--text-dim);
            text-transform: capitalize;
          }
          .footer-note {
            margin-top: 20px;
            text-align: center;
            font-size: 0.8rem;
            color: var(--text-light);
          }
          .footer-note a {
            color: var(--primary);
            text-decoration: none;
            font-weight: 600;
          }
          @media (max-width: 640px) {
            body { padding: 16px 12px; }
            .header { padding: 20px; }
            td, thead th { padding: 10px 12px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="brand-col">
              <div class="logo">J</div>
              <div>
                <h1>Sitemap XML <span>Jobydoo Agency</span></h1>
                <p class="desc">Plan du site indexable pour les moteurs de recherche (Google, Bing).</p>
              </div>
            </div>
            <div class="badge-counter">
              <span>Pages indexées :</span>
              <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong>
            </div>
          </div>

          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th style="width: 60%;">URL de la page</th>
                  <th style="width: 20%;">Fréquence</th>
                  <th style="width: 20%;">Priorité</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td class="url-cell">
                      <xsl:variable name="itemURL">
                        <xsl:value-of select="sitemap:loc"/>
                      </xsl:variable>
                      <a href="{$itemURL}">
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    <td>
                      <span class="pill-freq">
                        <xsl:value-of select="sitemap:changefreq"/>
                      </span>
                    </td>
                    <td>
                      <xsl:choose>
                        <xsl:when test="sitemap:priority &gt;= 0.9">
                          <span class="pill-priority high">
                            <xsl:value-of select="sitemap:priority"/>
                          </span>
                        </xsl:when>
                        <xsl:otherwise>
                          <span class="pill-priority">
                            <xsl:value-of select="sitemap:priority"/>
                          </span>
                        </xsl:otherwise>
                      </xsl:choose>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>

          <div class="footer-note">
            Jobydoo Agency · Agence Web, Media Buying &amp; CRM sur mesure au Maroc · <a href="https://www.jobydooagency.com/">jobydooagency.com</a>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
