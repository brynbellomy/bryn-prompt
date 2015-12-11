

set_prompt () {
  export PROMPT="$(bryn-prompt $COLUMNS,$LINES)"
  export PROMPT2='%{$fg[red]%}\ %{$reset_color%}'
}

precmd() {
  set_prompt
}





