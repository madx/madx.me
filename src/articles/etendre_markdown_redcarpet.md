title: Étendre Markdown avec RedCarpet
---

``` #haml
.date 20 décembre 2011
```

Étendre Markdown avec RedCarpet
===============================

RedCarpet 2 est sorti il y a environ 2 semaines, et j'utilisais déjà la version
de développement pour écrire mes posts sur ce blog.

La nouveauté principale est le changement complet d'API (adieu la convention
`Renderer.new(source).to_html`) au profit de plus de modularité et donc plus
d'extensibilité !

Créer son propre moteur de rendu devient très facile (on peut même générer autre
chose que du HTML si on veut), et voici un petit exemple de ce que j'utilise
pour ce blog :

```ruby
require 'albino'
class CustomMarkdown < Redcarpet::Render::HTML
  def block_code(code, language)
    language ||= 'ruby'
    Albino.colorize(code, language).gsub("\n", "&#10;")
  end

  def paragraph(text)
    classes = text.sub!(/^\.(\S+)/, '') ? $~[1].split('.') : []
    "\n<p class=\"#{classes.join(' ')}\">#{text}</p>\n"
  end

  def hrule
    "\n<hr />\n"
  end
end
```

Ce petit bout de code permet d'activer la coloration syntaxique du code via
[Albino][albino] et de donner des classes aux paragraphes en utilisant une
syntaxe similaire à [Haml][haml].

On peut bien sur ajouter beaucoup plus de choses que ça, et le tout est très
bien expliqué dans [le README de RedCarpet][readme].

[albino]: https://github.com/github/albino
[haml]: https://github.com/github/albino
[readme]: https://github.com/tanoku/redcarpet/blob/master/README.markdown
