# Use official PHP + Apache image
FROM php:8.2-apache

# Enable Apache mod_rewrite (needed for Twig routing)
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy composer files and install dependencies
COPY composer.json composer.lock ./
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    php composer-setup.php --install-dir=/usr/local/bin --filename=composer && \
    composer install --no-dev --optimize-autoloader && \
    rm composer-setup.php

# Copy all files
COPY . .

# Set Apache DocumentRoot to 'public'
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

# Fix permissions
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html

# Expose port 80
EXPOSE 80

# Start Apache in foreground
CMD ["apache2-foreground"]
