FROM ruby:2.3

ENV MIDDLEMAN_COMMAND=unknown

RUN apt-get update
RUN apt-get install -yq ruby ruby-dev build-essential libssl-dev libcurl4-gnutls-dev libexpat1-dev gettext unzip git nodejs \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/*
RUN gem install --no-document bundler

EXPOSE 4567

RUN mkdir -p /app/slate
RUN mkdir /app/slate/lib
RUN mkdir /app/slate/source

COPY ./* app/slate/
COPY ./lib /app/slate/lib
COPY ./source /app/slate/source/

WORKDIR /app/slate
RUN bundle install

ENTRYPOINT bundle exec middleman ${MIDDLEMAN_COMMAND}
