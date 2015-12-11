

set_prompt () {
  export PROMPT="$(bryn-prompt $COLUMNS,$LINES --colors)"
  export PROMPT2='%{$fg[red]%}\ %{$reset_color%}'
}

precmd() {
  set_prompt
}





