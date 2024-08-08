#dplyr - a grammar of data manipulation
#d: dataframe, plyr(plier): a kind of tool
#************************************************************************
#interface to work with data no matter where it is stored: data.frame, data.table, 
#or a database.Has five simple functions (filter, arrange,SELECT, mutate, and summarise)
#combined with group_by,these functions can be used to calculate group wise summary statistics.
#************************************************************************

#Use mtcars dataset, tibble(table pronounced as tibble in newzeland) package and dplyr library
#**************************************************************************
library(dplyr)
library(tibble)
#CREATE THE NAME OF THE ROW_NAMES AS IT HAS NO NAME INITIALLY

mtcars_tbl <- as_data_frame(tibble::rownames_to_column(mtcars, "cars"))

#View top 10 records
head(mtcars_tbl)

#Use of filter() 
#************************************************************************
#filter helps subset rows that match certain criteria. The first argument 
#is the name of the data.frame and the second (and subsequent) arguments 
#are the criteria that filter the data
#************************************************************************
filter(mtcars_tbl, cyl == 4)

data("iris")
iris
filter(iris, Species == "setosa")
filter(iris, Species == "setosa" & Petal.Length == 1.4)


#We can pass multiple criteria separated by a comma. To subset the cars 
#which have either 4 or 6 cylinders - cyl and have 5 gears - gear
filter(mtcars_tbl, cyl == 4 | cyl == 6, gear == 5)

#Use of slice() 
#************************************************************************
#Filter selects rows based on criteria, to select rows by position, use slice. 
#slice takes only 2 arguments: the first one is a data.frame and the second 
#is integer row values.Example: To select rows 6 through 9:
#************************************************************************
slice(mtcars_tbl, 6:9)

#Use of arrange() 
#************************************************************************
#Arrange is used to sort the data by a specified variable(s). Just like 
#the previous verb (and all other functions in dplyr), the first argument 
#is a data.frame, and consequent arguments are used to sort the data. 
#If more than one variable is passed, the data is first sorted by 
#the first variable, and then by the second variable, and so on
#************************************************************************
arrange(mtcars_tbl, hp)
arrange(mtcars_tbl, desc(mpg), cyl)   #Descending


#Use of select() 
#************************************************************************
#SELECT is used to select only a subset of variables. To select only mpg, disp, wt, qsec, and 
#vs from mtcars_tbs
select(mtcars_tbl, mpg, disp, wt, qsec, vs)

#: notation can be used to select consecutive columns. To select columns from cars through 
#disp and vs through carb:
select(mtcars_tbl, cars:disp)
select(mtcars_tbl, vs:carb)

select(mtcars_tbl, cars:disp, vs:carb)
select(mtcars_tbl, cylinders = cyl, displacement = disp)    #Rename column
rename(mtcars_tbl, cylinders = cyl, displacement = disp)    #Rename without dropping

#Use of mutate() 
#************************************************************************
#mutate can be used to add new columns to the data. Columns are added at the end of the data.frame
mutate(mtcars_tbl, weight_ton = wt/2, weight_pounds = weight_ton * 2000)

#To take new column only
transmute(mtcars_tbl, weight_ton = wt/2, weight_pounds = weight_ton * 2000)  


#Use of summarise() 
#************************************************************************
#summarise calculates summary statistics of variables by collapsing multiple values to a single
#value. It can calculate multiple statistics and we can name these summary columns in the same 
#statement.
summarise(mtcars_tbl, mean_mpg = mean(mpg), sd_mpg = sd(mpg),mean_disp = mean(disp), sd_disp = sd(disp))


#Use of group_by() 
#************************************************************************
#group_by can be used to perform group wise operations on data. When the verbs defined above 
#are applied on this grouped data, they are automatically applied to each group separately.
by_cyl <- group_by(mtcars_tbl, cyl)

summarise(by_cyl, mean_mpg = mean(mpg), sd_mpg = sd(mpg))


#Putting it all together
#************************************************************************
selected <- select(mtcars_tbl, cars:hp, gear)
ordered <- arrange(selected, cyl, desc(mpg))
by_cyl <- group_by(ordered, gear)
filter(by_cyl, mpg > 20, hp > 75)

#OR rewrting above with another syntax
filter(
  group_by(
    arrange(
      select(
        mtcars_tbl, cars:hp
      ), cyl, desc(mpg)
    ), cyl
  ),mpg > 20, hp > 75
)

#OR dplyr operations can be chained using the pipe %>% operator
mtcars_tbl %>%
  select(cars:hp) %>%
  arrange(cyl, desc(mpg)) %>%
  group_by(cyl) %>%
  filter(mpg > 20, hp > 75)

#Summarizing on multiple columns
mtcars_tbl %>% summarise_all(n_distinct)

#To find the number of distinct values for each column by cyl
mtcars_tbl %>%
  group_by(cyl) %>%
  summarise_all(n_distinct)

#To summarise specific multiple columns, use summarise_at
mtcars_tbl %>%
  group_by(cyl) %>%
  summarise_at(c("mpg", "disp", "hp"), mean)

#To apply multiple functions, either pass the function names as a character vector
mtcars_tbl %>%
  group_by(cyl) %>%
  summarise_at(c("mpg", "disp", "hp"),
               c("mean", "sd"))
mtcars_tbl %>%
  group_by(cyl) %>%
  summarise_at(c("mpg", "disp", "hp"),
               c(Mean = mean, SD = sd))

#Take the mean of all columns that are numeric grouped by cyl
mtcars_tbl %>%
  group_by(cyl) %>%
  summarise_if(is.numeric, mean)